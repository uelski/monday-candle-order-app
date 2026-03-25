import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
import { Box } from "@vibe/core";
import AppHeader from "./components/AppHeader";
import OrderForm from "./components/OrderForm";

const monday = mondaySdk();

const App = () => {
  return (
    <div className="App">
      <Box rounded="small" className="app-content">
        <AppHeader />
        <OrderForm monday={monday} />
      </Box>
    </div>
  );
};

export default App;
