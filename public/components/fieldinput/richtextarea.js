import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnNumberedList,
  BtnBulletList,
} from "react-simple-wysiwyg";

export default function RichTextarea({ value, label, disabled, onChange }) {
  const [html, setHtml] = useState(value);

  useEffect(() => {
    setHtml(value || "");
  }, [value]);

  const handleChange = (e) => {
    setHtml(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="mb-6">
      <label
        className="block mb-1 font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {label}
      </label>
      <EditorProvider>
        <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnNumberedList />
          <BtnBulletList />
        </Toolbar>
        <Editor
          value={html}
          onChange={handleChange}
          tagname="p"
          disabled={disabled}
          className="custom-input form-input"
          style={{
            minHeight: "120px",
            backgroundColor: disabled ? "var(--color-background-tertiary)" : "var(--color-background-secondary)",
            borderColor: "var(--color-border-primary)",
            color: "var(--color-text-primary)",
            outline: "none",
            transition: "border-color 0.25s ease, box-shadow 0.25s ease",
          }}
        />
      </EditorProvider>
    </div>
  );
}
