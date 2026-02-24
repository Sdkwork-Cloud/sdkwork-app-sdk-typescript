export type ValidatorResult = { valid: true } | { valid: false; errors: string[] };

export type Validator<T = unknown> = (value: T) => ValidatorResult;

export function createValidator<T>(validators: Validator<T>[]): Validator<T> {
  return (value: T): ValidatorResult => {
    const errors: string[] = [];

    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        errors.push(...result.errors);
      }
    }

    return errors.length === 0 ? { valid: true } : { valid: false, errors };
  };
}

export function required(message = 'This field is required'): Validator<unknown> {
  return (value: unknown): ValidatorResult => {
    if (value === null || value === undefined || value === '') {
      return { valid: false, errors: [message] };
    }
    return { valid: true };
  };
}

export function minLength(min: number, message?: string): Validator<string | unknown[]> {
  return (value: string | unknown[]): ValidatorResult => {
    if (value.length < min) {
      return { valid: false, errors: [message ?? `Minimum length is ${min}`] };
    }
    return { valid: true };
  };
}

export function maxLength(max: number, message?: string): Validator<string | unknown[]> {
  return (value: string | unknown[]): ValidatorResult => {
    if (value.length > max) {
      return { valid: false, errors: [message ?? `Maximum length is ${max}`] };
    }
    return { valid: true };
  };
}

export function min(min: number, message?: string): Validator<number> {
  return (value: number): ValidatorResult => {
    if (value < min) {
      return { valid: false, errors: [message ?? `Minimum value is ${min}`] };
    }
    return { valid: true };
  };
}

export function max(max: number, message?: string): Validator<number> {
  return (value: number): ValidatorResult => {
    if (value > max) {
      return { valid: false, errors: [message ?? `Maximum value is ${max}`] };
    }
    return { valid: true };
  };
}

export function pattern(regex: RegExp, message = 'Invalid format'): Validator<string> {
  return (value: string): ValidatorResult => {
    if (!regex.test(value)) {
      return { valid: false, errors: [message] };
    }
    return { valid: true };
  };
}

export function email(message = 'Invalid email address'): Validator<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern(emailRegex, message);
}

export function url(message = 'Invalid URL'): Validator<string> {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return pattern(urlRegex, message);
}

export function phone(message = 'Invalid phone number'): Validator<string> {
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  return pattern(phoneRegex, message);
}

export function integer(message = 'Must be an integer'): Validator<number> {
  return (value: number): ValidatorResult => {
    if (!Number.isInteger(value)) {
      return { valid: false, errors: [message] };
    }
    return { valid: true };
  };
}

export function positive(message = 'Must be a positive number'): Validator<number> {
  return (value: number): ValidatorResult => {
    if (value <= 0) {
      return { valid: false, errors: [message] };
    }
    return { valid: true };
  };
}

export function range(min: number, max: number, message?: string): Validator<number> {
  return (value: number): ValidatorResult => {
    if (value < min || value > max) {
      return { valid: false, errors: [message ?? `Value must be between ${min} and ${max}`] };
    }
    return { valid: true };
  };
}

export function oneOf<T>(values: T[], message?: string): Validator<T> {
  return (value: T): ValidatorResult => {
    if (!values.includes(value)) {
      return { valid: false, errors: [message ?? `Value must be one of: ${values.join(', ')}`] };
    }
    return { valid: true };
  };
}

export function custom<T>(
  validate: (value: T) => boolean,
  message: string
): Validator<T> {
  return (value: T): ValidatorResult => {
    if (!validate(value)) {
      return { valid: false, errors: [message] };
    }
    return { valid: true };
  };
}

export function validateObject<T extends Record<string, unknown>>(
  schema: { [K in keyof T]: Validator<T[K]> },
  data: T
): ValidatorResult {
  const errors: string[] = [];

  for (const key in schema) {
    const validator = schema[key];
    const result = validator(data[key]);
    if (!result.valid) {
      errors.push(...result.errors.map((e) => `${String(key)}: ${e}`));
    }
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateArray<T>(
  validator: Validator<T>,
  array: T[]
): ValidatorResult {
  const errors: string[] = [];

  array.forEach((item, index) => {
    const result = validator(item);
    if (!result.valid) {
      errors.push(...result.errors.map((e) => `[${index}]: ${e}`));
    }
  });

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export type { ValidatorResult as ValidationResult };
