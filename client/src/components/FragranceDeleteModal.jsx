import React from "react";
import { Text, Modal, ModalContent, ModalFooter, ModalFooterButtons } from "@vibe/core";

const FragranceDeleteModal = ({ fragrance, onConfirm, onClose }) => {
  return (
    <Modal
      show={!!fragrance}
      onClose={onClose}
      title="Delete Fragrance"
      contentSpacing
    >
      <ModalContent>
        <Text type="text1">
          Are you sure you want to delete <strong>{fragrance?.name}</strong>?
          This action cannot be undone.
        </Text>
      </ModalContent>
      <ModalFooter>
        <ModalFooterButtons
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          onPrimaryButtonClick={onConfirm}
          onSecondaryButtonClick={onClose}
        />
      </ModalFooter>
    </Modal>
  );
};

export default FragranceDeleteModal;
