import React from "react";
import { Flex, Text, IconButton } from "@vibe/core";
import { Edit, Delete } from "@vibe/icons";

const FragranceCard = ({ fragrance, onEdit, onDelete }) => {
  return (
    <div className="fragrance-card">
      <Flex justify="space-between" align="start">
        <div className="fragrance-card-info">
          <Text type="text1" weight="bold">
            {fragrance.name}
          </Text>
          <Text type="text2" color="secondary">
            {fragrance.category}
          </Text>
          {fragrance.description && (
            <Text type="text2" className="fragrance-card-desc">
              {fragrance.description}
            </Text>
          )}
        </div>
        <Flex gap="xs">
          <IconButton
            icon={Edit}
            size="small"
            kind="tertiary"
            ariaLabel="Edit"
            onClick={() => onEdit(fragrance)}
          />
          <IconButton
            icon={Delete}
            size="small"
            kind="tertiary"
            ariaLabel="Delete"
            onClick={() => onDelete(fragrance)}
          />
        </Flex>
      </Flex>
    </div>
  );
};

export default FragranceCard;
