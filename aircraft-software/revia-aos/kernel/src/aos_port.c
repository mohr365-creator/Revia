/*
 * Revia AOS — sampling and queuing port implementation
 *
 * Message storage is attached to the SOURCE port of each channel; the
 * DESTINATION descriptor's 'peer' field locates it. All storage is
 * static and bounded (AOS-HLR-003).
 *
 * @satisfies AOS-HLR-012 (sampling port semantics)
 * @satisfies AOS-HLR-013 (queuing port semantics)
 * @satisfies AOS-HLR-014 (port access control)
 */
#include <string.h>

#include "aos_internal.h"
#include "aos_hal.h"

typedef struct
{
    uint8_t       buf[AOS_MAX_QUEUE_DEPTH][AOS_MAX_MSG_BYTES];
    uint16_t      len[AOS_MAX_QUEUE_DEPTH];
    aos_time_us_t t_write;     /* sampling: time of last write          */
    uint8_t       head;        /* queuing: index of oldest message      */
    uint8_t       count;       /* queuing: messages queued              */
    bool          written;     /* sampling: ever written                */
} port_state_t;

static port_state_t s_port[AOS_MAX_PORTS];

void aos_port_reset_state(void)
{
    (void)memset(s_port, 0, sizeof(s_port));
}

/* Validate channel routing once the configuration is pinned. */
aos_ret_t aos_port_config_check(void)
{
    aos_ret_t ret = AOS_OK;
    uint8_t i;

    for (i = 0u; (ret == AOS_OK) && (i < aos_g_cfg->port_count); i++)
    {
        const aos_port_desc_t *p = &aos_g_cfg->ports[i];
        const aos_port_desc_t *q;

        if (p->peer >= aos_g_cfg->port_count)
        {
            ret = AOS_E_CONFIG;
        }
        else
        {
            q = &aos_g_cfg->ports[p->peer];
            if ((q->peer != i) ||                 /* must be mutual      */
                (q->kind != p->kind) ||           /* same protocol       */
                (q->dir == p->dir) ||             /* one src, one dest   */
                (q->max_msg_bytes != p->max_msg_bytes))
            {
                ret = AOS_E_CONFIG;
            }
        }
    }
    return ret;
}

/* Common entry checks for every port service. */
static aos_ret_t port_check(aos_port_id_t port, aos_port_kind_t kind,
                            aos_port_dir_t dir, const aos_port_desc_t **d_out)
{
    aos_ret_t ret = AOS_OK;
    const aos_port_desc_t *d = NULL;

    if (aos_g_cfg == NULL)
    {
        ret = AOS_E_STATE;
    }
    else if (port >= aos_g_cfg->port_count)
    {
        ret = AOS_E_RANGE;
    }
    else
    {
        d = &aos_g_cfg->ports[port];
        if ((d->kind != kind) || (d->dir != dir))
        {
            ret = AOS_E_PARAM;
        }
        else if ((aos_partition_current() != AOS_PART_ID_NONE) &&
                 (aos_partition_current() != d->owner))
        {
            /* A partition may only use its own ports (AOS-HLR-014). */
            ret = AOS_E_ACCESS;
        }
        else
        {
            *d_out = d;
        }
    }
    return ret;
}

aos_ret_t aos_port_lookup(const char *name, aos_port_id_t *port_out)
{
    aos_ret_t ret = AOS_E_RANGE;
    uint8_t i;

    if ((aos_g_cfg == NULL) || (name == NULL) || (port_out == NULL))
    {
        ret = AOS_E_PARAM;
    }
    else
    {
        for (i = 0u; i < aos_g_cfg->port_count; i++)
        {
            if (strncmp(name, aos_g_cfg->ports[i].name,
                        AOS_MAX_PORT_NAME) == 0)
            {
                *port_out = (aos_port_id_t)i;
                ret = AOS_OK;
                break;
            }
        }
    }
    return ret;
}

/* --- sampling -------------------------------------------------------- */

aos_ret_t aos_sampling_write(aos_port_id_t port, const void *msg, size_t len)
{
    const aos_port_desc_t *d = NULL;
    aos_ret_t ret = port_check(port, AOS_PORT_SAMPLING, AOS_PORT_SOURCE, &d);

    if (ret == AOS_OK)
    {
        if ((msg == NULL) || (len == 0u))
        {
            ret = AOS_E_PARAM;
        }
        else if (len > (size_t)d->max_msg_bytes)
        {
            ret = AOS_E_SIZE;
        }
        else
        {
            port_state_t *st = &s_port[port];

            (void)memcpy(st->buf[0], msg, len);
            st->len[0]   = (uint16_t)len;
            st->t_write  = aos_hal_now_us();
            st->written  = true;
        }
    }
    return ret;
}

aos_ret_t aos_sampling_read(aos_port_id_t port, void *buf, size_t buf_len,
                            size_t *len_out, bool *fresh_out)
{
    const aos_port_desc_t *d = NULL;
    aos_ret_t ret = port_check(port, AOS_PORT_SAMPLING,
                               AOS_PORT_DESTINATION, &d);

    if (ret == AOS_OK)
    {
        if ((buf == NULL) || (len_out == NULL) || (fresh_out == NULL))
        {
            ret = AOS_E_PARAM;
        }
        else
        {
            const port_state_t *st = &s_port[d->peer];

            if (!st->written)
            {
                ret = AOS_E_EMPTY;
            }
            else if ((size_t)st->len[0] > buf_len)
            {
                ret = AOS_E_SIZE;
            }
            else
            {
                const aos_time_us_t age =
                    aos_hal_now_us() - st->t_write;

                (void)memcpy(buf, st->buf[0], (size_t)st->len[0]);
                *len_out   = (size_t)st->len[0];
                *fresh_out = (d->refresh_us == 0u) ||
                             (age <= (aos_time_us_t)d->refresh_us);
            }
        }
    }
    return ret;
}

/* --- queuing --------------------------------------------------------- */

aos_ret_t aos_queuing_send(aos_port_id_t port, const void *msg, size_t len)
{
    const aos_port_desc_t *d = NULL;
    aos_ret_t ret = port_check(port, AOS_PORT_QUEUING, AOS_PORT_SOURCE, &d);

    if (ret == AOS_OK)
    {
        if ((msg == NULL) || (len == 0u))
        {
            ret = AOS_E_PARAM;
        }
        else if (len > (size_t)d->max_msg_bytes)
        {
            ret = AOS_E_SIZE;
        }
        else
        {
            port_state_t *st = &s_port[port];

            if (st->count >= d->queue_depth)
            {
                /* Bounded queue full: reject; never overwrite queued
                 * data (AOS-HLR-013). */
                ret = AOS_E_FULL;
            }
            else
            {
                const uint8_t slot =
                    (uint8_t)((st->head + st->count) % d->queue_depth);

                (void)memcpy(st->buf[slot], msg, len);
                st->len[slot] = (uint16_t)len;
                st->count++;
            }
        }
    }
    return ret;
}

aos_ret_t aos_queuing_receive(aos_port_id_t port, void *buf, size_t buf_len,
                              size_t *len_out)
{
    const aos_port_desc_t *d = NULL;
    aos_ret_t ret = port_check(port, AOS_PORT_QUEUING,
                               AOS_PORT_DESTINATION, &d);

    if (ret == AOS_OK)
    {
        if ((buf == NULL) || (len_out == NULL))
        {
            ret = AOS_E_PARAM;
        }
        else
        {
            port_state_t *st = &s_port[d->peer];

            if (st->count == 0u)
            {
                ret = AOS_E_EMPTY;
            }
            else if ((size_t)st->len[st->head] > buf_len)
            {
                ret = AOS_E_SIZE;
            }
            else
            {
                (void)memcpy(buf, st->buf[st->head],
                             (size_t)st->len[st->head]);
                *len_out = (size_t)st->len[st->head];
                st->head =
                    (uint8_t)((st->head + 1u) %
                              aos_g_cfg->ports[d->peer].queue_depth);
                st->count--;
            }
        }
    }
    return ret;
}
