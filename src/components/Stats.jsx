import React from 'react';

function Stats({ text }) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  // Average reading speed is ~200 words per minute
  const readTime = Math.ceil(words / 200) || 1;

  return (
    <div className="stats">
      <span>{words} words</span>
      <span>{chars} chars</span>
      <span>~{readTime} min read</span>
    </div>
  );
}

export default Stats;
