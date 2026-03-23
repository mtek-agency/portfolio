export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('fr-FR', options ?? { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date))
}

export function formatDateShort(date: string | Date) {
  return formatDate(date, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}