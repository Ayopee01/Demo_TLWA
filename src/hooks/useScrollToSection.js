// src/hooks/useScrollToSection.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToSection() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [hash]);
}
