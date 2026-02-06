import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App.jsx";
import "./styles/global.css";
import "./i18n.js"; 
import { AuthProvider } from "./context/authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);