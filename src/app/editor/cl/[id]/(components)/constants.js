// Font sizes in pixels
export const fontSizes = [
  { label: "Small", value: "12px" },
  { label: "Base", value: "14px" },
  { label: "Large", value: "16px" },
  { label: "XL", value: "20px" }
];

// Text colors (hex / CSS vars)
export const colors = [
  { label: "Gray 600", value: "#5B6C8F" },
  { label: "Gray 800", value: "#0A1F44" },
  { label: "Black", value: "#000000" },
  { label: "Blue 600", value: "#0056D2" }
];

// Margin top spacing in pixels
export const spacing = [
  { label: "mt-1", value: "4px" },
  { label: "mt-2", value: "8px" },
  { label: "mt-4", value: "16px" },
  { label: "mt-6", value: "24px" }
];

// Layout options
export const layouts = [
  { id: "primary", label: "Primary" },
  { id: "secondary", label: "Secondary" },
  { id: "tertiary", label: "Tertiary" },
  { id: "quaternary", label: "Quaternary" }
];

// Grid layout mapping (already used in Template01)
export const layoutGrid = {
  primary: "grid grid-cols-1 gap-4",
  secondary: "grid grid-cols-3 gap-4",
  tertiary: "grid grid-cols-3 gap-4",
  quaternary: "grid grid-cols-4 gap-4"
};
