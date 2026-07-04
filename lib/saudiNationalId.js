export const normalizeArabicDigits = (value = "") =>
  String(value)
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit));

export const normalizeNationalId = (value = "") =>
  normalizeArabicDigits(value).replace(/\D/g, "").slice(0, 10);

export const isValidSaudiNationalId = (value = "") => {
  const nationalId = normalizeNationalId(value);

  if (!/^1\d{9}$/.test(nationalId)) return false;

  const sum = nationalId
    .slice(0, 9)
    .split("")
    .reduce((total, digit, index) => {
      const number = Number(digit);
      if (index % 2 === 0) {
        const doubled = number * 2;
        return total + Math.floor(doubled / 10) + (doubled % 10);
      }
      return total + number;
    }, 0);

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(nationalId[9]);
};

export const buildNationalIdAccountEmail = (nationalId = "") =>
  `national-${normalizeNationalId(nationalId)}@users.c4rplatform.com`;
