function isoWeek(d: Date): number {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const y1 = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - y1.getTime()) / 86400000 + 1) / 7);
}

export function buildWeeks(now: Date, count: number): { label: string; start: Date; end: Date }[] {
  const result = [];
  for (let i = count - 1; i >= 0; i--) {
    const end = new Date(now);
    end.setDate(end.getDate() - i * 7);
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    result.push({ label: 'W' + isoWeek(start), start, end });
  }
  return result;
}

export const CASHFLOW_WEEKS_DEFAULT = 12;
