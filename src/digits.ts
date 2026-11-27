const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

/** Convert ASCII digits (0-9) in any string or number to Bangla digits (০-৯). */
export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** Convert Bangla digits (০-৯) in a string to ASCII digits (0-9). */
export function toEnglishDigits(input: string): string {
  return input.replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - 0x09e6));
}

/** Returns true if the string contains at least one Bangla digit. */
export function hasBanglaDigits(input: string): boolean {
  return /[০-৯]/.test(input);
}
