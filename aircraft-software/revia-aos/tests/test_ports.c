/*
 * Sampling/queuing port tests.
 *
 * @verifies AOS-HLR-012 (sampling semantics: latest value, freshness)
 * @verifies AOS-HLR-013 (queuing semantics: FIFO, bounded, no overwrite)
 * @verifies AOS-HLR-014 (port access control)
 */
#include <string.h>

#include "ut.h"
#include "test_fixture.h"
#include "aos_internal.h"
#include "hal_host.h"

void suite_ports(void)
{
    uint8_t buf[32];
    size_t len = 0u;
    bool fresh = false;

    (void)printf("suite: communication ports\n");

    UT_CASE("sampling read before any write -> EMPTY", "AOS-HLR-012");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_sampling_read(1u, buf, sizeof(buf), &len, &fresh)
             == AOS_E_EMPTY);

    UT_CASE("sampling delivers latest value, fresh", "AOS-HLR-012");
    UT_CHECK(aos_sampling_write(0u, "aaaa", 4u) == AOS_OK);
    UT_CHECK(aos_sampling_write(0u, "bbbbbb", 6u) == AOS_OK);
    UT_CHECK(aos_sampling_read(1u, buf, sizeof(buf), &len, &fresh)
             == AOS_OK);
    UT_CHECK(len == 6u);
    UT_CHECK(memcmp(buf, "bbbbbb", 6u) == 0);
    UT_CHECK(fresh);

    UT_CASE("sampling data goes stale after refresh period",
            "AOS-HLR-012");
    hal_host_consume_us(150000u);  /* refresh is 100 ms */
    UT_CHECK(aos_sampling_read(1u, buf, sizeof(buf), &len, &fresh)
             == AOS_OK);
    UT_CHECK(!fresh);

    UT_CASE("oversize sampling write rejected", "AOS-HLR-012");
    {
        uint8_t big[17];

        (void)memset(big, 0x55, sizeof(big));
        UT_CHECK(aos_sampling_write(0u, big, sizeof(big)) == AOS_E_SIZE);
    }

    UT_CASE("queuing is FIFO", "AOS-HLR-013");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    UT_CHECK(aos_queuing_send(2u, "m1", 2u) == AOS_OK);
    UT_CHECK(aos_queuing_send(2u, "m2", 2u) == AOS_OK);
    UT_CHECK(aos_queuing_receive(3u, buf, sizeof(buf), &len) == AOS_OK);
    UT_CHECK(memcmp(buf, "m1", 2u) == 0);
    UT_CHECK(aos_queuing_receive(3u, buf, sizeof(buf), &len) == AOS_OK);
    UT_CHECK(memcmp(buf, "m2", 2u) == 0);
    UT_CHECK(aos_queuing_receive(3u, buf, sizeof(buf), &len)
             == AOS_E_EMPTY);

    UT_CASE("full queue rejects send, preserves contents",
            "AOS-HLR-013");
    UT_CHECK(aos_queuing_send(2u, "x1", 2u) == AOS_OK);
    UT_CHECK(aos_queuing_send(2u, "x2", 2u) == AOS_OK);
    UT_CHECK(aos_queuing_send(2u, "x3", 2u) == AOS_OK);   /* depth 3 */
    UT_CHECK(aos_queuing_send(2u, "x4", 2u) == AOS_E_FULL);
    UT_CHECK(aos_queuing_receive(3u, buf, sizeof(buf), &len) == AOS_OK);
    UT_CHECK(memcmp(buf, "x1", 2u) == 0);

    UT_CASE("partition cannot use another partition's port",
            "AOS-HLR-014");
    fx_reset();
    UT_CHECK(aos_kernel_init(&fx.cfg) == AOS_OK);
    aos_sched_set_current_for_test(1u);   /* P1 impersonated */
    UT_CHECK(aos_sampling_write(0u, "zz", 2u) == AOS_E_ACCESS);
    aos_sched_set_current_for_test(0u);   /* P0: owner -> allowed */
    UT_CHECK(aos_sampling_write(0u, "zz", 2u) == AOS_OK);
    aos_sched_set_current_for_test(AOS_PART_ID_NONE);

    UT_CASE("direction enforced (read on a source port)", "AOS-HLR-014");
    UT_CHECK(aos_sampling_read(0u, buf, sizeof(buf), &len, &fresh)
             == AOS_E_PARAM);

    UT_CASE("port lookup by name", "AOS-HLR-014");
    {
        aos_port_id_t id = 0xFFu;

        UT_CHECK(aos_port_lookup("Q_DST", &id) == AOS_OK);
        UT_CHECK(id == 3u);
        UT_CHECK(aos_port_lookup("NO_SUCH_PORT", &id) == AOS_E_RANGE);
    }
}
