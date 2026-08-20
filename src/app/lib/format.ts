/** Format a price in Tunisian Dinar (TND). */
export function formatTND(amount: number): string {
  const value = new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 3,
    maximumFractionDigits: 3,
  }).format(amount);
  return `${value} DT`;
}

export function formatTimestampTN(date = new Date()): string {
  // Tunisia timezone (Africa/Tunis, UTC+1)
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Tunis",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}
