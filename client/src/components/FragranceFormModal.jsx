import React from "react";
import {
  TextField,
  TextArea,
  Modal,
  ModalContent,
  ModalFooter,
  ModalFooterButtons,
} from "@vibe/core";

const FragranceFormModal = ({ show, editing, form, saving, onFieldChange, onSave, onClose }) => {
  const isFormValid = form.name.trim() !== "" && form.category.trim() !== "";

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={editing ? "Edit Fragrance" : "Add Fragrance"}
      contentSpacing
    >
      <ModalContent>
        <div className="fragrance-form">
          <TextField
            title="Name"
            placeholder="e.g. Herb Garden"
            value={form.name}
            onChange={onFieldChange("name")}
            required
          />
          <TextField
            title="Category"
            placeholder="e.g. Herbaceous"
            value={form.category}
            onChange={onFieldChange("category")}
            required
          />
          <TextArea
            label="Description"
            placeholder="A short description of this fragrance..."
            value={form.description}
            onChange={(e) => onFieldChange("description")(e.target.value)}
          />
          <TextField
            title="Image URL"
            placeholder="https://example.com/image.jpg"
            value={form.image_url}
            onChange={onFieldChange("image_url")}
          />
        </div>
      </ModalContent>
      <ModalFooter>
        <ModalFooterButtons
          primaryButtonText={saving ? "Saving..." : "Save"}
          secondaryButtonText="Cancel"
          onPrimaryButtonClick={onSave}
          onSecondaryButtonClick={onClose}
          disablePrimaryButton={!isFormValid || saving}
        />
      </ModalFooter>
    </Modal>
  );
};

export default FragranceFormModal;
