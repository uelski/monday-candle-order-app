import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Button, Text, AttentionBox } from "@vibe/core";
import { Add } from "@vibe/icons";
import FragranceManagerSkeleton from "./FragranceManagerSkeleton";
import FragranceCard from "./FragranceCard";
import FragranceFormModal from "./FragranceFormModal";
import FragranceDeleteModal from "./FragranceDeleteModal";
import FragranceGate from "./FragranceGate";

const EMPTY_FORM = { name: "", description: "", category: "", image_url: "" };

const FragranceManager = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchFragrances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/api/fragrances`);
      if (!res.ok) throw new Error("Failed to load fragrances");
      const data = await res.json();
      setFragrances(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (unlocked) {
      fetchFragrances();
    }
  }, [unlocked, fetchFragrances]);

  if (!unlocked) {
    return <FragranceGate onUnlock={() => setUnlocked(true)} />;
  }

  const openAddModal = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (fragrance) => {
    setEditing(fragrance);
    setForm({
      name: fragrance.name,
      description: fragrance.description,
      category: fragrance.category,
      image_url: fragrance.image_url,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim()) return;
    setSaving(true);
    try {
      const url = editing
        ? `${apiUrl}/api/fragrances/${editing.id}`
        : `${apiUrl}/api/fragrances`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save fragrance");
      closeModal();
      await fetchFragrances();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${apiUrl}/api/fragrances/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete fragrance");
      setDeleteTarget(null);
      await fetchFragrances();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    }
  };

  const updateField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <FragranceManagerSkeleton />;

  if (error) {
    return (
      <Box className="fragrance-manager-container">
        <AttentionBox title="Error" text={error} type="danger" />
      </Box>
    );
  }

  return (
    <Box className="fragrance-manager-container">
      <Flex justify="space-between" align="center" className="fragrance-manager-toolbar">
        <Text type="text1" weight="bold">
          {fragrances.length} fragrance{fragrances.length !== 1 ? "s" : ""}
        </Text>
        <Button size="small" leftIcon={Add} onClick={openAddModal}>
          Add Fragrance
        </Button>
      </Flex>

      {fragrances.length === 0 ? (
        <Text type="text2" className="fragrance-manager-status">
          No fragrances yet. Add your first one!
        </Text>
      ) : (
        <div className="fragrance-list">
          {fragrances.map((f) => (
            <FragranceCard
              key={f.id}
              fragrance={f}
              onEdit={openEditModal}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <FragranceFormModal
        show={modalOpen}
        editing={editing}
        form={form}
        saving={saving}
        onFieldChange={updateField}
        onSave={handleSave}
        onClose={closeModal}
      />

      <FragranceDeleteModal
        fragrance={deleteTarget}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default FragranceManager;
