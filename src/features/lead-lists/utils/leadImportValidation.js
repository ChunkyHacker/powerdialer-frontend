import {
  leadImportSystemFields,
  MAX_LEAD_IMPORT_FILE_SIZE_BYTES,
} from '../data/mockLeadImportData.js'

const allowedExtensions = new Set(['csv', 'xls', 'xlsx'])
const genericMimeTypes = new Set([
  'application/octet-stream',
  'application/x-download',
])
const extensionMimeTypes = {
  csv: new Set([
    'text/csv',
    'application/csv',
    'text/plain',
    'application/vnd.ms-excel',
  ]),
  xls: new Set(['application/vnd.ms-excel']),
  xlsx: new Set([
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]),
}

function normalizeAlias(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const fieldAliasMap = new Map(
  leadImportSystemFields.flatMap((field) =>
    field.aliases.map((alias) => [normalizeAlias(alias), field.id]),
  ),
)

export function getLeadImportFileExtension(fileName) {
  const normalizedName = String(fileName ?? '').trim()
  const finalDotIndex = normalizedName.lastIndexOf('.')

  return finalDotIndex > -1
    ? normalizedName.slice(finalDotIndex + 1).toLocaleLowerCase('en-US')
    : ''
}

export function formatLeadImportBytes(bytes) {
  const normalizedBytes =
    typeof bytes === 'number' && Number.isFinite(bytes)
      ? Math.max(0, bytes)
      : 0

  if (normalizedBytes < 1024) {
    return `${normalizedBytes} B`
  }

  const units = ['KB', 'MB', 'GB']
  let value = normalizedBytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toLocaleString('en-US', {
    maximumFractionDigits: value >= 10 ? 1 : 2,
  })} ${units[unitIndex]}`
}

export function validateLeadImportExtension(file) {
  const extension = getLeadImportFileExtension(file?.name)

  if (!allowedExtensions.has(extension)) {
    return 'Choose a CSV or Excel file with a .csv, .xls, or .xlsx extension.'
  }

  return null
}

export function validateLeadImportMimeType(file) {
  const extension = getLeadImportFileExtension(file?.name)
  const mimeType = String(file?.type ?? '')
    .trim()
    .toLocaleLowerCase('en-US')

  if (!mimeType || genericMimeTypes.has(mimeType)) {
    return null
  }

  if (!extensionMimeTypes[extension]?.has(mimeType)) {
    return `The reported file type (${mimeType}) does not match the .${extension} extension.`
  }

  return null
}

export function validateLeadImportFileSize(file) {
  if (file?.size === 0) {
    return 'The selected file is empty. Choose a file that contains lead data.'
  }

  if (file?.size > MAX_LEAD_IMPORT_FILE_SIZE_BYTES) {
    return `The selected file is larger than the 10 MB upload limit (${formatLeadImportBytes(file.size)}).`
  }

  return null
}

export function validateLeadImportFile(file) {
  if (!file) {
    return 'Choose one CSV or Excel file to continue.'
  }

  return (
    validateLeadImportExtension(file) ??
    validateLeadImportMimeType(file) ??
    validateLeadImportFileSize(file)
  )
}

export function suggestLeadImportMapping(sourceColumnName) {
  return fieldAliasMap.get(normalizeAlias(sourceColumnName)) ?? 'ignore'
}

export function deriveLeadImportMappingValidation(columns) {
  const rowErrors = {}
  const destinationRows = new Map()

  columns.forEach((column) => {
    if (column.selectedFieldId === 'ignore') {
      return
    }

    const existingRows = destinationRows.get(column.selectedFieldId) ?? []
    existingRows.push(column)
    destinationRows.set(column.selectedFieldId, existingRows)
  })

  destinationRows.forEach((mappedColumns, destinationId) => {
    if (mappedColumns.length < 2) {
      return
    }

    const destinationLabel =
      leadImportSystemFields.find((field) => field.id === destinationId)
        ?.label ?? 'This field'
    const message = `${destinationLabel} is selected more than once. Choose a unique destination field.`

    mappedColumns.forEach((column) => {
      rowErrors[column.id] = message
    })
  })

  const hasRequiredPhoneMapping = columns.some(
    (column) => column.selectedFieldId === 'phone-number',
  )
  const sectionError = hasRequiredPhoneMapping
    ? null
    : 'Map one imported column to the required Phone Number field.'
  const firstInvalidColumnId =
    Object.keys(rowErrors)[0] ??
    (!hasRequiredPhoneMapping ? columns[0]?.id ?? null : null)

  return {
    firstInvalidColumnId,
    isValid: hasRequiredPhoneMapping && Object.keys(rowErrors).length === 0,
    rowErrors,
    sectionError,
  }
}

export function canStartLeadImport({
  phase,
  hasFile,
  mappingsValid,
  hasValidationSummary,
}) {
  return (
    phase === 'ready' &&
    hasFile &&
    mappingsValid &&
    hasValidationSummary
  )
}
