import React from "react";
import { TextField } from "@vibe/core";

const CustomerFields = ({ firstName, lastName, quantity, onFirstNameChange, onLastNameChange, onQuantityChange }) => {
  return (
    <div className="form-row-top">
      <div className="form-field">
        <TextField
          title="First Name"
          placeholder="Enter Customer First Name"
          value={firstName}
          onChange={onFirstNameChange}
          size="medium"
          required
        />
      </div>
      <div className="form-field">
        <TextField
          title="Last Name"
          placeholder="Enter Customer Last Name"
          value={lastName}
          onChange={onLastNameChange}
          size="medium"
          required
        />
      </div>
      <div className="form-field">
        <TextField
          title="Quantity"
          placeholder="1"
          value={quantity}
          onChange={onQuantityChange}
          type="number"
          size="medium"
          required
        />
      </div>
    </div>
  );
};

export default CustomerFields;
