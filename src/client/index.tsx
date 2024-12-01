import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

import "./index.css";

const ws = new WebSocket("ws://" + window.location.host);

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);