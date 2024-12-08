import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const DarkModeSwitcher: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    document.documentElement.classList.remove(isDarkMode ? "dark" : "light");
    document.documentElement.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleDarkMode} className="darkmode-button">
      <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
      {isDarkMode ? " Light Mode" : " Dark Mode"}
    </button>
  );
};

export default DarkModeSwitcher;
