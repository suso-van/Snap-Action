export interface CalendarEventData {
  title: string;
  startDate?: string | Date;
  endDate?: string | Date;
  location?: string;
  description?: string;
}

function formatIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function downloadIcsFile(event: CalendarEventData) {
  const start = event.startDate ? new Date(event.startDate) : new Date(Date.now() + 1000 * 60 * 60 * 24);
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 1000 * 60 * 60);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SnapAction//AI Screenshot Action Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:snapaction-${Date.now()}@snapaction.app`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${event.title.replace(/[,;]/g, ' ')}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n').replace(/[,;]/g, ' ')}` : '',
    event.location ? `LOCATION:${event.location.replace(/[,;]/g, ' ')}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(event: CalendarEventData): string {
  const start = event.startDate ? new Date(event.startDate) : new Date(Date.now() + 1000 * 60 * 60 * 24);
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 1000 * 60 * 60);

  const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const dates = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: dates,
    details: event.description || 'Created via SnapAction',
    location: event.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
