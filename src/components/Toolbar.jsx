import React from 'react';

const tools = [
  { label: 'B', syntax: '**text**', title: 'Bold' },
  { label: 'I', syntax: '*text*', title: 'Italic' },
  { label: 'H1', syntax: '# text', title: 'Heading 1' },
  { label: 'Link', syntax: '[title](url)', title: 'Link' },
  { label: '</>', syntax: '`text`', title: 'Code' },
  { label: 'Img', syntax: '![alt](url)', title: 'Image' },
  { label: '"', syntax: '> text', title: 'Quote' },
];

function Toolbar({ onInsert }) {
  return (
    <div className="toolbar">
      {tools.map((tool) => (
        <button 
          key={tool.label}
          onClick={() => onInsert(tool.syntax)}
          title={tool.title}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;
