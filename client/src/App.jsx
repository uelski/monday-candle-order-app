import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
import { Box } from "@vibe/core";
import AppHeader from "./components/AppHeader";
import OrderForm from "./components/OrderForm";
import FragranceManager from "./components/FragranceManager";

const monday = mondaySdk();

const App = () => {
  const [view, setView] = useState("order");
  const [context, setContext] = useState(null);

  useEffect(() => {
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  const toggleView = () => {
    setView((v) => (v === "order" ? "fragrances" : "order"));
  };

  return (
    <div className="App">
      <Box rounded="small" className="app-content">
        <AppHeader view={view} onMenuClick={toggleView} />
        {view === "order" ? (
          <OrderForm monday={monday} context={context} />
        ) : (
          <FragranceManager boardId={context?.boardId} />
        )}
      </Box>
    </div>
  );
};

export default App;
