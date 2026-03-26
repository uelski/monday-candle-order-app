import React from "react";
import { Flex, Icon, IconButton, Heading } from "@vibe/core";
import { Filter, Menu } from "@vibe/icons";

const AppHeader = ({ view, onMenuClick }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      className="app-header"
    >
      <Flex align="center" gap="xs">
        <Heading type="h3">
          {view === "order" ? "Order Maker" : "Fragrance Manager"}
        </Heading>
        {view === "order" && <Icon icon={Filter} iconSize={18} />}
      </Flex>

      <IconButton
        icon={Menu}
        size="small"
        kind="tertiary"
        ariaLabel="Menu"
        onClick={onMenuClick}
      />
    </Flex>
  );
};

export default AppHeader;
