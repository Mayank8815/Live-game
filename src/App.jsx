import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Preloader from "./pages/Preloader";
import Details from "./pages/Details";
import Homex from "./pages/leela";
import Bazar from "./pages/bazar";

function Contact() {
  return <h1 className="hidden text-3xl p-10">Contact Page</h1>;
}

export default function App() {
  useEffect(() => {
    // ==========================================
    // 1. DISABLE PULL-TO-REFRESH (Mobile/Tab)
    // ==========================================
    // This stops the browser's native bounce/refresh effect
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";


    // ==========================================
    // 3. DISABLE RIGHT CLICK (Context Menu)
    // ==========================================
    const preventRightClick = (e) => {
      e.preventDefault();
    };
    window.addEventListener("contextmenu", preventRightClick);

    // ==========================================
    // 4. DISABLE DEVELOPER TOOLS & INSPECT
    // ==========================================
    const preventDevTools = (e) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I or Cmd+Option+I (Inspect)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "I" || e.key === "i")
      ) {
        e.preventDefault();
      }

      // Ctrl+Shift+J or Cmd+Option+J (Console)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "J" || e.key === "j")
      ) {
        e.preventDefault();
      }

      // Ctrl+Shift+C or Cmd+Option+C (Element Selector)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "C" || e.key === "c")
      ) {
        e.preventDefault();
      }

      // Ctrl+U or Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventDevTools, { passive: false });

    // ==========================================
    // CLEANUP ON UNMOUNT
    // ==========================================
    return () => {
      document.documentElement.style.overscrollBehavior = "auto";
      document.body.style.overscrollBehavior = "auto";
      window.removeEventListener("contextmenu", preventRightClick);
      window.removeEventListener("keydown", preventDevTools);
    };
  }, []); // run only once on mount

  return (
    <div>
      {/* Routes */}
      <Routes>
        <Route path="/leela" element={<Homex />} />
        <Route path="/Bazar/:marketName" element={<Bazar />} />
        <Route path="/" element={<Home />} />
        <Route path="/Preloader" element={<Preloader />} />
        <Route path="/Details/:marketName" element={<Details />} />
        <Route path="*" element={<ErrorPage type="404" />} />
      </Routes>
    </div>
  );
}
