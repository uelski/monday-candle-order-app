import React from "react";
import { Dropdown, Chips, Flex } from "@vibe/core";

const MAX_SCENTS = 3;

const FragranceSelector = ({ fragrances, selectedScents, onSelect, onRemove, onClearAll }) => {
  const dropdownOptions = fragrances
    .filter((f) => !selectedScents.some((s) => s.id === f.id))
    .map((f) => ({
      value: f.id,
      label: f.name,
    }));

  return (
    <div className="form-row-bottom">
      <div className="form-field">
        <Dropdown
          title="Fragrances"
          placeholder={
            selectedScents.length >= MAX_SCENTS
              ? "3 fragrances selected"
              : `Select fragrances (${selectedScents.length}/${MAX_SCENTS})`
          }
          options={dropdownOptions}
          onChange={onSelect}
          disabled={selectedScents.length >= MAX_SCENTS}
          clearable
          onClear={onClearAll}
          multi
          multiline
          size="medium"
          value={null}
        />
        {selectedScents.length > 0 && (
          <Flex gap="small" className="scent-chips">
            {selectedScents.map((scent) => (
              <Chips
                key={scent.id}
                label={scent.name}
                onDelete={() => onRemove(scent.id)}
                color="positive"
              />
            ))}
          </Flex>
        )}
      </div>
    </div>
  );
};

export default FragranceSelector;
