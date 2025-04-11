interface DateFormatOptions {
  year: number;
  month: number;
  day: number;
}

export const formatDateToString = ({
  year,
  month,
  day,
}: DateFormatOptions): string => {
  const formattedMonth: string = month.toString().padStart(2, '0');
  const formattedDay: string = day.toString().padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const getLocalDateParts = (date: Date): DateFormatOptions => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

export const getStartOfDay = (date: Date): Date => {
  const newDate: Date = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const getCurrentLocalDate = (): string =>
  formatDateToString(getLocalDateParts(getStartOfDay(new Date())));
