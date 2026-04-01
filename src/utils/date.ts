const pad = (n: number): string => `${n}`.padStart(2, '0');

export const formatUiDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const parseUiDate = (value: string): string => {
  const [datePart, timePart] = value.split(' ');
  if (!datePart || !timePart) return new Date().toISOString();

  const [dd, mm, yyyy] = datePart.split('/').map(Number);
  const [hh, min] = timePart.split(':').map(Number);
  const date = new Date(yyyy, (mm || 1) - 1, dd || 1, hh || 0, min || 0);

  return date.toISOString();
};

export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const sameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
