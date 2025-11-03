import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing your moment...', 
  height = 300,
  preview = 'edit',
  hideToolbar = false,
  className = ''
}) => {
  const [editorValue, setEditorValue] = useState(value);

  const handleChange = (val) => {
    setEditorValue(val || '');
    if (onChange) {
      onChange(val || '');
    }
  };

  // Custom toolbar commands for moments
  const customCommands = [
    {
      name: 'bold',
      keyCommand: 'bold',
      buttonProps: { 'aria-label': 'Add bold text' },
      icon: <strong>B</strong>,
    },
    {
      name: 'italic',
      keyCommand: 'italic',
      buttonProps: { 'aria-label': 'Add italic text' },
      icon: <em>I</em>,
    },
    {
      name: 'header',
      keyCommand: 'header',
      buttonProps: { 'aria-label': 'Add header text' },
      icon: <strong>H</strong>,
    },
    {
      name: 'unordered-list',
      keyCommand: 'unordered-list',
      buttonProps: { 'aria-label': 'Add unordered list' },
      icon: '•',
    },
    {
      name: 'ordered-list',
      keyCommand: 'ordered-list',
      buttonProps: { 'aria-label': 'Add ordered list' },
      icon: '1.',
    },
    {
      name: 'link',
      keyCommand: 'link',
      buttonProps: { 'aria-label': 'Add link' },
      icon: '🔗',
    },
    {
      name: 'quote',
      keyCommand: 'quote',
      buttonProps: { 'aria-label': 'Add quote' },
      icon: '❝',
    }
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <MDEditor
        value={editorValue}
        onChange={handleChange}
        preview={preview}
        height={height}
        hideToolbar={hideToolbar}
        data-color-mode="light"
        textareaProps={{
          placeholder: placeholder,
          style: {
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: 'inherit'
          }
        }}
        previewOptions={{
          style: {
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: 'inherit'
          }
        }}
        commands={customCommands}
      />
      
      <style>{`
        .rich-text-editor {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e1e5e9;
        }
        
        .rich-text-editor .w-md-editor {
          background-color: #ffffff;
        }
        
        .rich-text-editor .w-md-editor-text-container {
          font-size: 14px !important;
        }
        
        .rich-text-editor .w-md-editor-text {
          font-size: 14px !important;
          line-height: 1.6 !important;
          font-family: inherit !important;
        }
        
        .rich-text-editor .w-md-editor-preview {
          font-size: 14px !important;
          line-height: 1.6 !important;
          font-family: inherit !important;
        }
        
        .rich-text-editor .w-md-editor-toolbar {
          background-color: #f8f9fa;
          border-bottom: 1px solid #e1e5e9;
          padding: 8px;
        }
        
        .rich-text-editor .w-md-editor-toolbar-child {
          color: #495057;
        }
        
        .rich-text-editor .w-md-editor-toolbar-child:hover {
          background-color: #e9ecef;
          color: #212529;
        }
        
        /* Focus styles */
        .rich-text-editor .w-md-editor.w-md-editor-focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .rich-text-editor .w-md-editor {
            font-size: 16px;
          }
          
          .rich-text-editor .w-md-editor-toolbar {
            flex-wrap: wrap;
            gap: 4px;
          }
          
          .rich-text-editor .w-md-editor-toolbar-child {
            min-width: 32px;
            height: 32px;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .rich-text-editor .w-md-editor {
            background-color: #2d3748;
            color: #e2e8f0;
          }
          
          .rich-text-editor .w-md-editor-toolbar {
            background-color: #4a5568;
            border-bottom-color: #718096;
          }
          
          .rich-text-editor .w-md-editor-toolbar-child {
            color: #e2e8f0;
          }
          
          .rich-text-editor .w-md-editor-toolbar-child:hover {
            background-color: #718096;
          }
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
