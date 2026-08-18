import React from 'react';

const themes = ['Light', 'Dark', 'Dracula', 'Solarized'];

function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <select 
      className="theme-select"
      value={currentTheme} 
      onChange={(e) => onThemeChange(e.target.value)}
    >
      {themes.map(theme => (
        <option key={theme} value={theme}>{theme}</option>
      ))}
    </select>
  );
}

export default ThemeSelector;
