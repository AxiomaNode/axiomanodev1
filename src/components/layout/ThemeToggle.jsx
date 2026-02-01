import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <label className="theme-toggle">
      <input
        type="checkbox"
        checked={dark}
        onChange={() => setDark(!dark)}
      />
      <div className="toggle" />
    </label>
  );
}
