# Software Code Standard — DAL A C profile

Document: REV-AOS-SCS-001 rev A
Scope: all flight software in this repository. MISRA C:2012-aligned;
deviations require a recorded rationale approved at code review.

## Rules (RAC = Revia Airborne C)

| # | Rule |
|---|---|
| RAC-1 | C99; freestanding-compatible kernel; no compiler extensions |
| RAC-2 | Fixed-width types only (`uint32_t`…); no bare `int`/`long` in interfaces |
| RAC-3 | No dynamic allocation (`malloc` family banned); storage statically sized from `aos_limits.h` |
| RAC-4 | No recursion, direct or indirect |
| RAC-5 | All loops statically bounded; bound evident at the loop |
| RAC-6 | Single `return` per function |
| RAC-7 | Every condition's `else`/`default` handled explicitly |
| RAC-8 | All external inputs (parameters, messages, config) validated before use |
| RAC-9 | No floating point in the kernel; partitions may use float with explicit range clamps at every boundary |
| RAC-10 | Pointers: no arithmetic beyond array indexing; no casts removing `const`; null-checked at API boundaries |
| RAC-11 | `goto`, `setjmp`/`longjmp` banned in flight code (host HAL test capture exempt, compiled out of flight builds) |
| RAC-12 | Every status return checked or explicitly discarded with `(void)` and a rationale evident from context |
| RAC-13 | Headers idempotent (`#ifndef` guards); no object definitions in headers |
| RAC-14 | Each source item tagged `@satisfies <REQ-ID>`; orphan code is rejected at review |
| RAC-15 | Comments state constraints and intent, not restatements of code |
| RAC-16 | Builds warning-clean at `-Wall -Wextra -Werror -pedantic` (or target-toolchain equivalent) |

## Naming

`aos_` public kernel API · `aos_g_` kernel-internal shared state ·
`s_` file-static state · `k_` constants · types end `_t`.
