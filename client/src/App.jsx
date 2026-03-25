import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
import AppHeader from "./components/AppHeader";
import OrderForm from "./components/OrderForm";

const monday = mondaySdk();

const App = () => {
  return (
    <div className="App">
      <AppHeader />
      <OrderForm monday={monday} />
    </div>
  );
};

export default App;
