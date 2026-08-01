/**
 * Defines the Lead Import field catalogue and deterministic preview fixtures.
 *
 * Preview values and validation results are intentionally simulated. The
 * selected browser File supplies metadata only; its contents are never parsed.
 */
export const MAX_LEAD_IMPORT_FILE_SIZE_BYTES = 10 * 1024 * 1024

export const LEAD_IMPORT_ACCEPT = [
  '.csv',
  '.xls',
  '.xlsx',
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
].join(',')

export const leadImportSystemFields = [
  {
    id: 'first-name',
    label: 'First Name',
    aliases: ['first_name', 'firstname', 'first name'],
  },
  {
    id: 'last-name',
    label: 'Last Name',
    aliases: ['last_name', 'lastname', 'last name'],
  },
  {
    id: 'phone-number',
    label: 'Phone Number',
    required: true,
    aliases: ['phone', 'phone_number', 'mobile', 'telephone'],
  },
  {
    id: 'email-address',
    label: 'Email Address',
    aliases: ['email', 'email_address'],
  },
  {
    id: 'company',
    label: 'Company',
    aliases: ['company', 'organization'],
  },
  {
    id: 'job-title',
    label: 'Job Title',
    aliases: ['job_title', 'title'],
  },
  {
    id: 'address',
    label: 'Address',
    aliases: ['address', 'street'],
  },
  {
    id: 'city',
    label: 'City',
    aliases: ['city'],
  },
  {
    id: 'state',
    label: 'State',
    aliases: ['state', 'province'],
  },
  {
    id: 'zip-code',
    label: 'ZIP Code',
    aliases: ['zip', 'zipcode', 'postal_code'],
  },
  {
    id: 'country',
    label: 'Country',
    aliases: ['country'],
  },
  {
    id: 'notes',
    label: 'Notes',
    aliases: ['notes', 'comments'],
  },
  {
    id: 'do-not-call',
    label: 'Do Not Call',
    aliases: ['dnc', 'do_not_call'],
  },
]

const normalColumns = [
  {
    id: 'source-first-name',
    name: 'first_name',
    previewValues: ['Amelia', 'Noah', 'Maya'],
  },
  {
    id: 'source-last-name',
    name: 'last_name',
    previewValues: ['Tan', 'Williams', 'Chen'],
  },
  {
    id: 'source-phone',
    name: 'phone_number',
    previewValues: ['+65 8123 4567', '+1 415 555 0198', '+61 412 345 678'],
  },
  {
    id: 'source-email',
    name: 'email_address',
    previewValues: ['amelia@example.com', 'noah@example.com', 'maya@example.com'],
  },
  {
    id: 'source-company',
    name: 'organization',
    previewValues: ['Northstar Labs', 'Summit Systems', 'Orbit Commerce'],
  },
  {
    id: 'source-title',
    name: 'job_title',
    previewValues: ['Sales Director', 'VP, Revenue', 'Operations Manager'],
  },
  {
    id: 'source-city',
    name: 'city',
    previewValues: ['Singapore', 'San Francisco', 'Melbourne'],
  },
  {
    id: 'source-country',
    name: 'country',
    previewValues: ['Singapore', 'United States', 'Australia'],
  },
  {
    id: 'source-dnc',
    name: 'do_not_call',
    previewValues: ['false', 'no', '0'],
  },
  {
    id: 'source-lead-source',
    name: 'lead_source',
    previewValues: ['Webinar', 'Referral', 'Conference'],
  },
]

const issueColumns = [
  {
    id: 'source-first-name',
    name: 'firstname',
    previewValues: ['Avery', 'Jordan', 'Sam'],
  },
  {
    id: 'source-last-name',
    name: 'lastname',
    previewValues: ['Morgan', 'Lee', 'Patel'],
  },
  {
    id: 'source-phone',
    name: 'mobile',
    previewValues: ['+65 9012 3456', 'not-a-number', ''],
  },
  {
    id: 'source-email',
    name: 'email',
    previewValues: ['avery@example.com', 'jordan.example.com', 'sam@example.com'],
  },
  {
    id: 'source-company',
    name: 'company',
    previewValues: ['Atlas Works', 'Harbor Group', 'Cedar Labs'],
  },
  {
    id: 'source-comments',
    name: 'comments',
    previewValues: ['Requested a callback', 'Met at event', 'Priority account'],
  },
  {
    id: 'source-dnc',
    name: 'dnc',
    previewValues: ['false', 'maybe', 'true'],
  },
]

export const mockLeadImportProfiles = {
  normal: {
    id: 'normal',
    columns: normalColumns,
    summary: {
      totalRows: 1248,
      validRows: 1219,
      errorRows: 29,
    },
    issues: [
      {
        id: 'normal-invalid-phone',
        rowNumber: 184,
        sourceColumn: 'phone_number',
        message: 'Phone number does not match a supported format.',
        severity: 'error',
      },
      {
        id: 'normal-invalid-email',
        rowNumber: 527,
        sourceColumn: 'email_address',
        message: 'Email address is missing a valid domain.',
        severity: 'error',
      },
      {
        id: 'normal-duplicate-phone',
        rowNumber: 902,
        sourceColumn: 'phone_number',
        message: 'Phone number duplicates an earlier row.',
        severity: 'error',
      },
    ],
  },
  issues: {
    id: 'issues',
    columns: issueColumns,
    summary: {
      totalRows: 486,
      validRows: 421,
      errorRows: 65,
    },
    issues: [
      {
        id: 'issues-invalid-phone',
        rowNumber: 8,
        sourceColumn: 'mobile',
        message: 'Phone number does not match a supported format.',
        severity: 'error',
      },
      {
        id: 'issues-missing-phone',
        rowNumber: 19,
        sourceColumn: 'mobile',
        message: 'Required phone number is missing.',
        severity: 'error',
      },
      {
        id: 'issues-invalid-email',
        rowNumber: 31,
        sourceColumn: 'email',
        message: 'Email address is not valid.',
        severity: 'error',
      },
      {
        id: 'issues-duplicate-phone',
        rowNumber: 44,
        sourceColumn: 'mobile',
        message: 'Phone number duplicates an earlier row.',
        severity: 'error',
      },
      {
        id: 'issues-invalid-dnc',
        rowNumber: 57,
        sourceColumn: 'dnc',
        message: 'Do Not Call must be true, false, yes, no, 1, or 0.',
        severity: 'error',
      },
    ],
  },
}
