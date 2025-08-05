interface ItemWithDate {
  Date: string;
}

export const groupByMonth = <T extends ItemWithDate>(
  items: T[],
): Map<string, T[]> => {
  const groupedItems = new Map<string, T[]>();
  items.forEach((item) => {
    const date = new Date(item.Date);
    if (isNaN(date.getTime())) {
      // Skip items with invalid date strings
      return;
    }
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
    if (!groupedItems.has(month)) {
      groupedItems.set(month, []);
    }
    groupedItems.get(month)?.push(item);
  });
  return groupedItems;
};
