"use client";
import React from "react";
import { DateFieldInput, RichTextarea,CommonTextarea } from "@components/fieldinput";
import { formatLabel } from "./index";

const richTextKeys = [  "responsibilities",  "projectDescription",  "technicalSkills",  "tools",  "softSkills",  "languagesSpoken",  "certificationsSkills",  "summary"];
const renderField = ([key, rawVal],formData = {},setFormData,parentIndex = null,isLoading = false) => {
  const label = formatLabel(key);
  const value = rawVal ?? "";
  const id = parentIndex !== null ? `${key}-${parentIndex}` : key;
  const isDate = key.toLowerCase().includes("date");
  
  const handleOnChange = (newValue) => {
    const sanitizedValue = typeof newValue === "string" ? newValue : String(newValue);
    const updatedObject = { ...formData, [key]: sanitizedValue };
    setFormData(updatedObject);
  };
  const isRichText = richTextKeys.includes(key);
  if (isDate) {
    return (
      <DateFieldInput
        key={id}
        id={id}
        name={key}
        label={label}
        value={value}
        disabled={isLoading}
        onChange={handleOnChange}
      />
    );
  }

  if (isRichText) {
    return (
      <RichTextarea
        key={id}
        id={id}
        name={key}
        label={label}
        value={value}
        disabled={isLoading}
        placeholder={label}
        onChange={handleOnChange}
      />
    );
  }
  return (
    <CommonTextarea
      key={id}
      id={id}
      name={key}
      label={label}
      value={value}
      disabled={isLoading}
      placeholder={label}
      onChange={handleOnChange}
    />
  );
};

export default renderField;