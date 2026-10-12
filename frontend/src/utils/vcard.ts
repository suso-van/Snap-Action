export interface ContactVCardData {
  name: string;
  phone?: string;
  email?: string;
  organization?: string;
  title?: string;
  address?: string;
  notes?: string;
}

export function downloadVCardFile(contact: ContactVCardData) {
  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.name || 'Contact'}`,
    `N:${contact.name?.split(' ').reverse().join(';') || 'Contact;;;'}`,
    contact.organization ? `ORG:${contact.organization}` : '',
    contact.title ? `TITLE:${contact.title}` : '',
    contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : '',
    contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : '',
    contact.address ? `ADR;TYPE=WORK:;;${contact.address.replace(/[,;]/g, ' ')};;;` : '',
    contact.notes ? `NOTE:${contact.notes.replace(/\n/g, '\\n')}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([vcardLines], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${(contact.name || 'contact').replace(/[^a-zA-Z0-9]/g, '_')}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
