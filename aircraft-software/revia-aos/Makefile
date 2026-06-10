# Revia AOS — host verification build
#
# Flight builds use a separate, configuration-controlled toolchain and
# linker layout per target computer; this Makefile builds the kernel,
# the R-100 module configuration, and the partitions for host-based
# requirements testing and simulation.

CC      ?= cc
CFLAGS  := -std=c99 -pedantic -Wall -Wextra -Werror -O2 -g \
           -DAOS_HOST_BUILD \
           -Ikernel/include -Ikernel/src -Iconfig \
           -Ipartitions/include \
           -Ipartitions/fcs -Ipartitions/iom -Ipartitions/disp \
           -Ipartitions/fms -Ipartitions/maint -Ipartitions/mon \
           -Itools/host_sim -Itests
LDFLAGS := -lm

BUILD := build

KERNEL_SRC := kernel/src/aos_kernel.c \
              kernel/src/aos_port.c \
              kernel/src/aos_health.c \
              kernel/src/aos_sched.c

PART_SRC   := partitions/fcs/fcs_law.c \
              partitions/fcs/fcs_main.c \
              partitions/iom/iom_main.c \
              partitions/disp/disp_main.c \
              partitions/fms/fms_main.c \
              partitions/maint/maint_main.c \
              partitions/mon/mon_main.c

CFG_SRC    := config/module_config.c
HAL_SRC    := tools/host_sim/hal_host.c

SIM_SRC    := tools/host_sim/main.c
TEST_SRC   := tests/test_main.c tests/test_fixture.c \
              tests/test_foundations.c \
              tests/test_config.c tests/test_ports.c \
              tests/test_health.c tests/test_sched.c \
              tests/test_fcs_law.c tests/test_apps.c \
              tests/test_mon.c tests/test_integration.c

CORE_SRC := $(KERNEL_SRC) $(PART_SRC) $(CFG_SRC) $(HAL_SRC)

CORE_OBJ := $(CORE_SRC:%.c=$(BUILD)/%.o)
SIM_OBJ  := $(SIM_SRC:%.c=$(BUILD)/%.o)
TEST_OBJ := $(TEST_SRC:%.c=$(BUILD)/%.o)

.PHONY: all test sim clean

all: $(BUILD)/aos_sim $(BUILD)/aos_test

$(BUILD)/%.o: %.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD)/aos_sim: $(CORE_OBJ) $(SIM_OBJ)
	$(CC) $^ -o $@ $(LDFLAGS)

$(BUILD)/aos_test: $(CORE_OBJ) $(TEST_OBJ)
	$(CC) $^ -o $@ $(LDFLAGS)

test: $(BUILD)/aos_test
	./$(BUILD)/aos_test

sim: $(BUILD)/aos_sim
	./$(BUILD)/aos_sim

clean:
	rm -rf $(BUILD)
