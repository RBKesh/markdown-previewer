import React, { useState, useEffect, useCallback, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import Toolbar from './components/Toolbar';
import ThemeSelector from './components/ThemeSelector';
import Stats from './components/Stats';
import './App.css';

// Configure marked to use highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  breaks: true,
  gfm: true
});

const DEFAULT_MARKDOWN = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://github.com/RBKesh), and
> Block Quotes!

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.

1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![React Logo](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)
`;

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState('Light');
  const editorRef = useRef(null);

  // Sync theme with body
  useEffect(() => {
    document.body.className = `theme-${theme.toLowerCase()}`;
    
    // Update highlight.js theme based on app theme
    const hljsTheme = document.getElementById('hljs-theme');
    if (hljsTheme) {
      const isDark = ['Dark', 'Dracula'].includes(theme);
      hljsTheme.href = isDark 
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css';
    }
  }, [theme]);

  const handleEditorChange = (e) => {
    setMarkdown(e.target.value);
  };

  const getSanitizedHtml = useCallback(() => {
    const rawHtml = marked.parse(markdown);
    return { __html: DOMPurify.sanitize(rawHtml) };
  }, [markdown]);

  const insertSyntax = (syntax) => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;
    
    let insertion = syntax;
    let newCursorPos = start + syntax.length;

    // Handle different syntaxes
    if (syntax.includes('text')) {
      insertion = syntax.replace('text', text.substring(start, end) || 'text');
      newCursorPos = start + insertion.length;
    }

    const newText = text.substring(0, start) + insertion + text.substring(end);
    setMarkdown(newText);
    
    // Set focus back and move cursor (needs setTimeout to wait for React to update)
    setTimeout(() => {
      editor.focus();
      editor.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleExportHTML = () => {
    const htmlContent = \`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Exported Document</title>
        <style>body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }</style>
      </head>
      <body>\${DOMPurify.sanitize(marked.parse(markdown))}</body>
      </html>
    \`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Markdown Previewer</h1>
        <div className="header-controls">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <button className="btn-export" onClick={handleExportHTML}>HTML</button>
          <button className="btn-export" onClick={handleExportPDF}>PDF</button>
        </div>
      </header>

      <div className="main-content">
        <div className="pane-container">
          <div className="editor-pane">
            <div className="pane-header">
              <span>Editor</span>
              <Toolbar onInsert={insertSyntax} />
            </div>
            <textarea
              ref={editorRef}
              id="editor"
              value={markdown}
              onChange={handleEditorChange}
              spellCheck="false"
            />
          </div>
          
          <div className="preview-pane">
            <div className="pane-header">
              <span>Preview</span>
              <Stats text={markdown} />
            </div>
            <div 
              id="preview"
              dangerouslySetInnerHTML={getSanitizedHtml()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
