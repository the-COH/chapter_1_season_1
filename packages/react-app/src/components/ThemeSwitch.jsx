import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function ThemeSwitcher() {
  const theme = window.localStorage.getItem("theme");
  const [isDarkMode, setIsDarkMode] = useState(!(!theme || theme === "light"));
  const { switcher, currentTheme, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = isChecked => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  return (
    <div className="main items-center flex fade-in" style={{ position: "fixed", right: 10, bottom: 10 }}>
      <span style={{ padding: 8 }}>{currentTheme === "dark" ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}</span>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
}
