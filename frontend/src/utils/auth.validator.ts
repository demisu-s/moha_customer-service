import { RegisterData } from "../store/types";

interface ValidationRule {
  field: keyof RegisterData;
  method: "length" | "equals" | "regex";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
  validWhen: boolean;
  message: string;
}

export const validator = (
  formDetails: RegisterData,
  fieldsToValidate: (keyof RegisterData)[]
) => {
  const errors: Record<string, string> = {};

  const rules: ValidationRule[] = [
    {
      field: "password",
      method: "length",
      args: [6],
      validWhen: true,
      message: "Password should have at least 6 characters",
    },
    {
      field: "firstName",
      method: "length",
      args: [2],
      validWhen: true,
      message: "First name should have at least 2 characters",
    },
    {
      field: "userId",
      method: "length",
      args: [2],
      validWhen: true,
      message: "userId should be a valid",
    },
    {
      field: "lastName",
      method: "length",
      args: [2],
      validWhen: true,
      message: "Last name should have at least 2 characters",
    },
  ];

  rules.forEach((rule) => {
    if (!fieldsToValidate.includes(rule.field)) {
      return;
    }

    const fieldValue = formDetails[rule.field];

    let isValid = false;
    switch (rule.method) {
      case "length":
        isValid =
          typeof fieldValue === "string" && fieldValue.length >= rule.args[0];
        break;
      case "equals":
        isValid = fieldValue === rule.args[0];
        break;
      case "regex":
        isValid =
          typeof fieldValue === "string" && rule.args[0].test(fieldValue);
        break;
    }

    if (isValid !== rule.validWhen) {
      errors[rule.field] = rule.message;
    }
  });

  return errors;
};
