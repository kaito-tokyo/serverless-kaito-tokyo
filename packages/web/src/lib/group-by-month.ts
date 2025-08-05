interface ItemWithDate {
  Date: string;
}

export const groupByMonth = <T extends ItemWithDate>(items: T[]): { [key: string]: T[] } => {
  const groupedItems: { [key: string]: T[] } = {};
  items.forEach((item) => {
    const date = new Date(item.Date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!groupedItems[month]) {
      groupedItems[month] = [];
    }
    groupedItems[month].push(item);
  });
  return groupedItems;
};
