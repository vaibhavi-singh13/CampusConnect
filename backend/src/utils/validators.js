export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
export const isValidId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));
export const cleanString = (value) => typeof value === "string" ? value.trim() : "";
export const asStringArray = (value) => Array.isArray(value)
  ? value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 30)
  : [];
