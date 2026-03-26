import React, { useState } from "react";
import { Box, Flex, TextField, Button, Text } from "@vibe/core";

const PASSCODE = "demo";

const FragranceGate = ({ onUnlock }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (value === PASSCODE) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Box className="fragrance-gate">
      <Flex direction="column" align="center" gap="small">
        <Text type="text1" weight="bold">
          Enter passcode to manage fragrances
        </Text>
        <div className="fragrance-gate-input">
          <TextField
            placeholder="Passcode"
            value={value}
            onChange={setValue}
            type="password"
            onKeyDown={handleKeyDown}
            validation={error ? { status: "error", text: "Incorrect passcode" } : undefined}
          />
        </div>
        <Button size="small" onClick={handleSubmit}>
          Submit
        </Button>
      </Flex>
    </Box>
  );
};

export default FragranceGate;
