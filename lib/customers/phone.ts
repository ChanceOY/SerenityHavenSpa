export function normalizeGhanaPhone(input: string): string {
  const compact = input.trim().replace(/[\s().-]/g, "");

  if (/^0\d{9}$/.test(compact)) {
    return `+233${compact.slice(1)}`;
  }

  if (/^\+233\d{9}$/.test(compact)) {
    return compact;
  }

  if (/^233\d{9}$/.test(compact)) {
    return `+${compact}`;
  }

  throw new Error("Enter a valid Ghana phone number, for example 0541639802 or +233541639802.");
}
