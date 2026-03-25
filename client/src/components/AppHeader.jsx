import React from "react";
import { Flex, Icon, IconButton, Heading } from "@vibe/core";
import { Filter, Menu } from "@vibe/icons";

const AppHeader = () => {
  return (
    <Flex
      justify="space-between"
      align="center"
      className="app-header"
    >
      <Flex align="center" gap="xs">
        <Heading type="h3">Order Maker</Heading>
        <Icon icon={Filter} iconSize={18} />
      </Flex>

      <IconButton
        icon={Menu}
        size="small"
        kind="tertiary"
        disabled
        ariaLabel="Menu"
      />
    </Flex>
  );
};

export default AppHeader;
