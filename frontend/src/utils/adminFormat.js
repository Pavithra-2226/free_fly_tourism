export const STATUS_OPTIONS = ["Pending", "Contacted", "Confirmed / Booked", "Cancelled"];

export const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Contacted: "bg-sky-50 text-sky-700 border-sky-200",
  "Confirmed / Booked": "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateRange(from, to) {
  return `${formatDate(from)} - ${formatDate(to)}`;
}

export function formatPrice(price) {
  if (price === null || price === undefined) return "—";
  return `₹${Number(price).toLocaleString("en-IN")}/-`;
}

export function digitsOnly(phone) {
  return (phone || "").replace(/[^\d]/g, "");
}
