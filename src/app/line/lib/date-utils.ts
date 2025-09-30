// lib/date-utils.ts
export const TZ_BKK = "Asia/Bangkok";

export function ymdToDateUTC(ymd: string): Date {
  return new Date(`${ymd}T00:00:00Z`);
}
export function addDaysYMD(ymd: string, days: number): string {
  const d = ymdToDateUTC(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function todayYMD(tz: string = TZ_BKK): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
}
export function formatYMDThai(
  ymd: string,
  opts?: { tz?: string; buddhist?: boolean; style?: "short" | "long" | "numeric" }
): string {
  const { tz = TZ_BKK, buddhist = true, style = "numeric" } = opts ?? {};
  const date = ymdToDateUTC(ymd);
  const base = "th-TH";
  const locale = buddhist ? `${base}-u-ca-buddhist` : base;

  if (style === "numeric") {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: tz,
    }).format(date);
  }
  return new Intl.DateTimeFormat(locale, {
    weekday: style === "long" ? "long" : undefined,
    day: "2-digit",
    month: style === "long" ? "long" : "2-digit",
    year: "numeric",
    timeZone: tz,
  }).format(date);
}
