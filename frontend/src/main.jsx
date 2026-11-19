import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminApp from "./pages/AdminApp.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import "./index.css";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const Page = path === "/admin" ? AdminApp : path === "/contact" ? ContactPage : App;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><Page /></React.StrictMode>
);
