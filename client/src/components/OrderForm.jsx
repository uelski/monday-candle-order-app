import React, { useState, useEffect, useCallback } from "react";
import { AttentionBox, Button, Heading, Flex, Box } from "@vibe/core";
import CustomerFields from "./CustomerFields";
import FragranceSelector from "./FragranceSelector";
import OrderFormSkeleton from "./OrderFormSkeleton";

const MAX_SCENTS = 3;

const OrderForm = ({ monday }) => {
  const [context, setContext] = useState(null);
  const [fragrances, setFragrances] = useState([]);
  const [selectedScents, setSelectedScents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    monday.execute("valueCreatedForUser");
    monday.listen("context", (res) => {
      setContext(res.data);
    });

    let cancelled = false;

  const fetchFragrances = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/fragrances`);
      const data = await res.json();
      if (!cancelled) {
          setFragrances(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFragrances();

    // cleanup — prevents state update if component unmounts before fetch resolves
    return () => {
      cancelled = true;
    };
  }, []);

  const handleScentSelect = useCallback(
    (option) => {
      if (!option || selectedScents.length >= MAX_SCENTS) return;
      const fragrance = fragrances.find((f) => f.id === option.value);
      if (!fragrance) return;
      if (selectedScents.some((s) => s.id === fragrance.id)) return;
      setSelectedScents((prev) => [...prev, fragrance]);
    },
    [fragrances, selectedScents]
  );

  const handleScentRemove = useCallback((scentId) => {
    setSelectedScents((prev) => prev.filter((s) => s.id !== scentId));
  }, []);

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    Number(quantity) >= 1 &&
    selectedScents.length === MAX_SCENTS;

  const resetForm = () => {
    setSelectedScents([]);
    setFirstName("");
    setLastName("");
    setQuantity("1");
  };

  const handleSubmit = async () => {
    if (!isFormValid || !context?.boardId) return;
    setSubmitting(true);

    try {
      const columnValues = JSON.stringify({
        scent_1: { text: selectedScents[0].name },
        scent_2: { text: selectedScents[1].name },
        scent_3: { text: selectedScents[2].name },
        quantity: { number: Number(quantity) },
        status: { label: "New" },
      });

      await monday.api(
        `mutation ($boardId: ID!, $name: String!, $cols: JSON!) {
          create_item(
            board_id: $boardId,
            item_name: $name,
            column_values: $cols
          ) { id }
        }`,
        {
          variables: {
            boardId: context.boardId,
            name: `Order — ${firstName} ${lastName} — ${selectedScents.map((s) => s.name).join(", ")}`,
            cols: columnValues,
          },
        }
      );

      monday.execute("notice", {
        message: "Order placed successfully!",
        type: "success",
      });

      resetForm();
    } catch (err) {
      console.error("Failed to create order:", err);
      monday.execute("notice", {
        message: "Failed to place order. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <OrderFormSkeleton />;

  if (error) {
    return (
      <Box className="order-form-container">
        <AttentionBox
          title="Something went wrong!"
          text={error}
          type="danger"
        />
      </Box>
    );
  }

  return (
    <Box className="order-form-container">

      <div className="form-grid">
        <CustomerFields
          firstName={firstName}
          lastName={lastName}
          quantity={quantity}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onQuantityChange={setQuantity}
        />

        <FragranceSelector
          fragrances={fragrances}
          selectedScents={selectedScents}
          onSelect={handleScentSelect}
          onRemove={handleScentRemove}
          onClearAll={() => setSelectedScents([])}
        />
      </div>

      <Flex justify="start" className="form-actions">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
          loading={submitting}
          size="medium"
        >
          Start Order
        </Button>
      </Flex>
    </Box>
  );
};

export default OrderForm;
