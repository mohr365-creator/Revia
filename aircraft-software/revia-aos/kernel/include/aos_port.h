/*
 * Revia AOS — inter-partition communication ports
 *
 * ARINC 653-style sampling and queuing ports. Routing (which source
 * port feeds which destination ports) is fixed in the module
 * configuration; partitions can only access ports they own.
 *
 * Sampling port: holds the latest message only; readers receive a
 * validity flag derived from the configured refresh period.
 * Queuing port: bounded FIFO; overflow is reported to the sender and
 * never overwrites queued data.
 *
 * @satisfies AOS-HLR-012 (sampling port semantics)
 * @satisfies AOS-HLR-013 (queuing port semantics)
 * @satisfies AOS-HLR-014 (port access control)
 */
#ifndef AOS_PORT_H
#define AOS_PORT_H

#include "aos_types.h"
#include "aos_limits.h"

typedef enum
{
    AOS_PORT_SAMPLING = 0,
    AOS_PORT_QUEUING  = 1
} aos_port_kind_t;

typedef enum
{
    AOS_PORT_SOURCE      = 0,
    AOS_PORT_DESTINATION = 1
} aos_port_dir_t;

/* Immutable port descriptor (module configuration). */
typedef struct
{
    char            name[AOS_MAX_PORT_NAME];
    aos_port_kind_t kind;
    aos_port_dir_t  dir;
    aos_part_id_t   owner;          /* partition allowed to use it       */
    uint16_t        max_msg_bytes;  /* <= AOS_MAX_MSG_BYTES              */
    uint8_t         queue_depth;    /* queuing only; <= AOS_MAX_QUEUE_DEPTH */
    aos_dur_us_t    refresh_us;     /* sampling dest only: validity age  */
    aos_port_id_t   peer;           /* destination port fed by this source,
                                       or source feeding this destination */
} aos_port_desc_t;

/* Look up a port by name within the calling partition's configuration.
 * (Names are unique per module; ownership is still enforced.) */
aos_ret_t aos_port_lookup(const char *name, aos_port_id_t *port_out);

/* Sampling ports ----------------------------------------------------- */

/* Write the latest value to a SOURCE sampling port. Atomic with
 * respect to readers in other windows. */
aos_ret_t aos_sampling_write(aos_port_id_t port,
                             const void *msg, size_t len);

/* Read the latest value from a DESTINATION sampling port. On success
 * *fresh_out is true iff the message age is within the configured
 * refresh period. Returns AOS_E_EMPTY if nothing was ever written. */
aos_ret_t aos_sampling_read(aos_port_id_t port,
                            void *buf, size_t buf_len,
                            size_t *len_out, bool *fresh_out);

/* Queuing ports ------------------------------------------------------ */

/* Append a message to a SOURCE queuing port. AOS_E_FULL if the bounded
 * queue is full (message NOT enqueued; existing data preserved). */
aos_ret_t aos_queuing_send(aos_port_id_t port,
                           const void *msg, size_t len);

/* Remove the oldest message from a DESTINATION queuing port.
 * AOS_E_EMPTY if no message is queued. */
aos_ret_t aos_queuing_receive(aos_port_id_t port,
                              void *buf, size_t buf_len,
                              size_t *len_out);

#endif /* AOS_PORT_H */
