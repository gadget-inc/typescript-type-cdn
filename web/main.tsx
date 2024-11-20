import { Provider } from "@gadgetinc/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { api } from "./api";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found for booting react app");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider value={api.connection.currentClient}>
      <App />
    </Provider>
  </React.StrictMode>
);
