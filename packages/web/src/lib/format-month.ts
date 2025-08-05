export const formatMonthForDisplay = (month: string) => {
  const [year, monthStr] = month.split("-");
  const isValidYear = /^\d{4}$/.test(year);
  const isValidMonth =
    /^\d{1,2}$/.test(monthStr) &&
    Number(monthStr) >= 1 &&
    Number(monthStr) <= 12;
  if (isValidYear && isValidMonth) {
    const dateObj = new Date(Number(year), Number(monthStr) - 1);
    return dateObj.toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
    });
  }
  return `${year}-${monthStr}`; // fallback to raw string
};
