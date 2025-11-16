const defaultLocale = 'ja-JP';

const displayOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const getFormatter = (locale = defaultLocale) => new Intl.DateTimeFormat(locale, displayOptions);

export const formatDisplayDate = (value: string, locale = defaultLocale) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return getFormatter(locale).format(date);
};

export const toISODate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split('T')[0];
};
