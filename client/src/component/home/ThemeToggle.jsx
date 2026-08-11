import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
const ThemeToggle = () => {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <button
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-solid)] text-lg"
      onClick={() => setDark(!dark)}
      aria-label="Toggle theme"
    >
      {dark ? <FiSun /> : <FiMoon />}
    </button>
  );
};
export default ThemeToggle;
