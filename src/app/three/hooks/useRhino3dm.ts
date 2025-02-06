import { useEffect } from "react";

export const useRhino3dm = (load: boolean) => {
  useEffect(() => {
    if (!load) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/rhino3dm@8.9.0/rhino3dm.min.js"; // No `.module.min.js`
    script.async = true;

    script.onload = () => {
      console.log("rhino3dm.js loaded");
      if (window.rhino3dm) {
        window.rhino3dm().then((rhino: any) => {});
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script); // Cleanup on component unmount
    };
  }, [load]);
};
