export const membershipTypeLabels: Record<string, string> = {
  basic: "Энгийн",
  premium: "Премиум",
  athlete: "Тамирчин",
};

export const membershipStatusLabels: Record<string, string> = {
  active: "Идэвхтэй",
  suspended: "Түр зогсоосон",
  expired: "Хугацаа дууссан",
};

export const roleLabels: Record<string, string> = {
  super_admin: "Ерөнхий админ",
  branch_manager: "Салбарын менежер",
  trainer: "Дасгалжуулагч",
  viewer: "Үзэгч",
};

export const monthLabels: Record<string, string> = {
  "1": "1-р сар",
  "2": "2-р сар",
  "3": "3-р сар",
  "4": "4-р сар",
  "5": "5-р сар",
  "6": "6-р сар",
  "7": "7-р сар",
  "8": "8-р сар",
  "9": "9-р сар",
  "10": "10-р сар",
  "11": "11-р сар",
  "12": "12-р сар",
};

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("mn-MN").format(num) + "₮";
}

export function formatNumber(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  return new Intl.NumberFormat("mn-MN").format(n);
}
