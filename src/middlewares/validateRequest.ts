import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "email" | "array" | "uuid";
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
  regex?: RegExp;
  message?: string;
};

const validateField = (value: any, rule: ValidationRule): string | null => {
  // Check required
  if (rule.required && (value === undefined || value === null || value === "")) {
    return rule.message || `${rule.field} is required.`;
  }

  // If value is not provided and not required, skip
  if (value === undefined || value === null) {
    return null;
  }

  // Type checks
  if (rule.type === "string" && typeof value !== "string") {
    return `${rule.field} must be a string.`;
  }

  if (rule.type === "number" && typeof value !== "number") {
    return `${rule.field} must be a number.`;
  }

  if (rule.type === "boolean" && typeof value !== "boolean") {
    return `${rule.field} must be a boolean.`;
  }

  if (rule.type === "email" && typeof value === "string") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${rule.field} must be a valid email.`;
    }
  }

  if (rule.type === "uuid" && typeof value === "string") {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      return `${rule.field} must be a valid UUID.`;
    }
  }

  if (rule.type === "array" && !Array.isArray(value)) {
    return `${rule.field} must be an array.`;
  }

  // String length checks
  if (typeof value === "string") {
    if (rule.minLength && value.length < rule.minLength) {
      return `${rule.field} must be at least ${rule.minLength} characters.`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${rule.field} must not exceed ${rule.maxLength} characters.`;
    }
  }

  // Number range checks
  if (typeof value === "number") {
    if (rule.min !== undefined && value < rule.min) {
      return `${rule.field} must be at least ${rule.min}.`;
    }
    if (rule.max !== undefined && value > rule.max) {
      return `${rule.field} must not exceed ${rule.max}.`;
    }
  }

  // Enum check
  if (rule.enum && !rule.enum.includes(value)) {
    return `${rule.field} must be one of: ${rule.enum.join(", ")}.`;
  }

  // Regex check
  if (rule.regex && typeof value === "string" && !rule.regex.test(value)) {
    return rule.message || `${rule.field} format is invalid.`;
  }

  return null;
};

const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: { path: string; message: string }[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];
      const error = validateField(value, rule);
      if (error) {
        errors.push({ path: rule.field, message: error });
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errorDetails: errors,
      });
      return;
    }

    next();
  };
};

export default validateRequest;