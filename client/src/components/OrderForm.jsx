import React, { useState, useEffect, useCallback } from "react";
import { AttentionBox, Button, Heading, Flex, Box } from "@vibe/core";
import CustomerFields from "./CustomerFields";
import FragranceSelector from "./FragranceSelector";
import OrderFormSkeleton from "./OrderFormSkeleton";

const MAX_SCENTS = 3;

const OrderForm = ({ monday, context }) => {
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

  const handleScentChange = useCallback(
    (options) => {
      if (!options || !Array.isArray(options)) {
        setSelectedScents([]);
        return;
      }
      const scents = options
        .slice(0, MAX_SCENTS)
        .map((opt) => fragrances.find((f) => f.id === opt.value))
        .filter(Boolean);
      setSelectedScents(scents);
    },
    [fragrances]
  );

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    Number(quantity) > 0 &&
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
        dropdown: { labels: selectedScents.map(s => s.name) },
        numbers:  quantity,
        status:   { label: "New Order" },
        text:     firstName,
        text6:    lastName,
        date_1:   { date: new Date().toISOString().split('T')[0] },
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
          onChange={handleScentChange}
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
