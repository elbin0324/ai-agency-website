// Tools we connect to, named in plain text only: no logos, no partnership implied (BRIEF.md honesty rules).
// Copy source: content/COPY.md §2.2. Rendered as `.integrations` > `.integration` (DESIGN.md §6.19):
// the name in Geist plus a mono category microlabel ("Gmail / EMAIL").

export type IntegrationCategory =
  | 'Email' | 'Spreadsheets' | 'Documents' | 'Accounting' | 'E-commerce' | 'CRM'
  | 'Advertising' | 'Chat' | 'Calendar' | 'Payments' | 'Scheduling' | 'Video'
  | 'Marketing' | 'Field service' | 'Local listings' | 'Tasks' | 'Files' | 'Support' | 'Phone and SMS';

export type Integration = { name: string; category: IntegrationCategory };

/** The 16 shown on Home and wherever the strip appears, in COPY.md order. */
export const integrations: Integration[] = [
  { name: 'Gmail', category: 'Email' },
  { name: 'Outlook', category: 'Email' },
  { name: 'Excel', category: 'Spreadsheets' },
  { name: 'Google Sheets', category: 'Spreadsheets' },
  { name: 'PowerPoint', category: 'Documents' },
  { name: 'QuickBooks', category: 'Accounting' },
  { name: 'Xero', category: 'Accounting' },
  { name: 'Shopify', category: 'E-commerce' },
  { name: 'HubSpot', category: 'CRM' },
  { name: 'Salesforce', category: 'CRM' },
  { name: 'Google Ads', category: 'Advertising' },
  { name: 'Meta Ads', category: 'Advertising' },
  { name: 'Slack', category: 'Chat' },
  { name: 'Microsoft Teams', category: 'Chat' },
  { name: 'Google Calendar', category: 'Calendar' },
  { name: 'Stripe', category: 'Payments' },
];

/** Swap-ins for layouts or industry pages that need them (COPY.md §2.2). */
export const integrationsMore: Integration[] = [
  { name: 'Square', category: 'Payments' },
  { name: 'Calendly', category: 'Scheduling' },
  { name: 'Zoom', category: 'Video' },
  { name: 'Pipedrive', category: 'CRM' },
  { name: 'Mailchimp', category: 'Marketing' },
  { name: 'Klaviyo', category: 'Marketing' },
  { name: 'Jobber', category: 'Field service' },
  { name: 'Google Business Profile', category: 'Local listings' },
  { name: 'Asana', category: 'Tasks' },
  { name: 'Trello', category: 'Tasks' },
  { name: 'SharePoint', category: 'Files' },
  { name: 'Dropbox', category: 'Files' },
  { name: 'Zendesk', category: 'Support' },
  { name: 'Twilio', category: 'Phone and SMS' },
];

export const integrationsCopy = {
  eyebrow: 'Works with your tools',
  headline: 'Works inside the tools your team already uses.',
  subhead:
    'No new system to learn. Agents connect to your email, calendar, spreadsheets, books, CRM, ad accounts and phone lines, and do the work where it already happens.',
  microcopy:
    'Plus most tools with an API or a clean export. Product names are trademarks of their owners and are listed to show what we connect to, not a partnership or endorsement.',
};
