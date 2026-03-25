import React from "react";
import { Dropdown, Text } from "@vibe/core";

const MAX_SCENTS = 3;

const FragranceSelector = ({ fragrances, selectedScents, onChange, onClearAll }) => {
  const allOptions = fragrances.map((f) => ({
    value: f.id,
    label: f.name,
  }));

  const selectedValues = selectedScents.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div className="form-row-bottom">
      <div className="form-field">
        <Dropdown
          title="Fragrances"
          placeholder={`Select fragrances (${selectedScents.length}/${MAX_SCENTS})`}
          options={allOptions}
          onChange={onChange}
          clearable
          multi
          multiline
          onClear={onClearAll}
          size="medium"
          value={selectedValues}
          menuPortalTarget={document.body}
          isOptionDisabled={() => selectedScents.length >= MAX_SCENTS}
        />
        {selectedScents.length > 0 && selectedScents.length !== MAX_SCENTS && (
          <Text type="text2" color="negative" className="fragrance-validation">
            Must select exactly 3 fragrances
          </Text>
        )}
      </div>
    </div>
  );
};

export default FragranceSelector;
