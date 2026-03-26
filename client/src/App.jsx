import React, { useState } from "react";
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

  const toggleView = () => {
    setView((v) => (v === "order" ? "fragrances" : "order"));
  };

  return (
    <div className="App">
      <Box rounded="small" className="app-content">
        <AppHeader view={view} onMenuClick={toggleView} />
        {view === "order" ? (
          <OrderForm monday={monday} />
        ) : (
          <FragranceManager />
        )}
      </Box>
    </div>
  );
};

export default App;
