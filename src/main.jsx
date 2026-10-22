import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./components/DataContext";
 
import "./index.css";
const style = document.createElement("style");
style.innerHTML = `
  body {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
`;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("");
}
document.head.appendChild(style);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
          <App />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
// register PWA
