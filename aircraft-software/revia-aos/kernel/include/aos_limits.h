/*
 * Revia AOS — static resource limits
 *
 * All kernel storage is sized at compile time from these limits; the
 * kernel performs no dynamic allocation (AOS-HLR-003). The module
 * configuration is validated against these limits during cold start
 * (aos_kernel_init) and the module refuses to enter NORMAL mode if any
 * limit is exceeded.
 *
 * @satisfies AOS-HLR-003
 */
#ifndef AOS_LIMITS_H
#define AOS_LIMITS_H

#define AOS_MAX_PARTITIONS        8u   /* hosted partitions per module      */
#define AOS_MAX_WINDOWS           16u  /* schedule windows per major frame  */
#define AOS_MAX_PORTS             32u  /* comm. ports per module            */
#define AOS_MAX_MSG_BYTES         256u /* max message size, any port        */
#define AOS_MAX_QUEUE_DEPTH       16u  /* max messages in a queuing port    */
#define AOS_MAX_HM_EVENTS         64u  /* health-monitor event log depth    */
#define AOS_MAX_PART_NAME         16u  /* partition name incl. terminator   */
#define AOS_MAX_PORT_NAME         24u  /* port name incl. terminator        */

#endif /* AOS_LIMITS_H */
