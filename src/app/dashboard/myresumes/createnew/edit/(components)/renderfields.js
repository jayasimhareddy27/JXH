"use client";
import React from "react";
import { DateFieldInput, RichTextarea } from "@components/fieldinput";
import { formatLabel, handleChange } from "./index";

const renderField = (
  [key, rawVal],
  formData,
  setFormData,
  parentIndex,
  isLoading
) => {
  const label = formatLabel(key);
  const value = rawVal ?? "";
  const id = parentIndex !== null ? `${parentIndex}-${key}` : key;
  const isDate = key.toLowerCase().includes("date");

  return isDate ? (
    <DateFieldInput
      key={id}
      id={id}
      name={key}
      label={label}
      value={value}
      disabled={isLoading}
      onChange={(val) => handleChange(formData, setFormData, val, key, parentIndex)}
    />
  ) : (
    <RichTextarea
      key={id}
      id={id}
      name={key}
      label={label}
      value={value}
      disabled={isLoading}
      placeholdername={label}
      onChange={(val) => handleChange(formData, setFormData, val, key, parentIndex)}
    />
  );
};

export default renderField;