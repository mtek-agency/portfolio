export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('fr-FR', options ?? { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date))
}
