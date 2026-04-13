import { useEffect } from "react";

export function useJsonLd(id: string, data: object | null) {
  useEffect(() => {
    if (!data) return;

    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [id, data ? JSON.stringify(data) : null]);
}
