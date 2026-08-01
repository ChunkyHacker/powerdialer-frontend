import { CircleCheck, CircleX, Info } from 'lucide-react'
import Badge from '../../../components/ui/Badge.jsx'
import Card from '../../../components/ui/Card.jsx'
import CardContent from '../../../components/ui/CardContent.jsx'
import CardDescription from '../../../components/ui/CardDescription.jsx'
import CardHeader from '../../../components/ui/CardHeader.jsx'
import CardTitle from '../../../components/ui/CardTitle.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import StatusIndicator from '../../../components/ui/StatusIndicator.jsx'

const phaseStatus = {
  empty: { label: 'Waiting for file', tone: 'neutral' },
  'file-rejected': { label: 'File rejected', tone: 'danger' },
  'file-validating': { label: 'Inspecting file', tone: 'info' },
  mapping: { label: 'Mapping required', tone: 'warning' },
  'validation-validating': { label: 'Validating rows', tone: 'info' },
  ready: { label: 'Ready to import', tone: 'success' },
  importing: { label: 'Importing', tone: 'live' },
  success: { label: 'Import complete', tone: 'success' },
  failure: { label: 'Action failed', tone: 'danger' },
}

function SummaryCount({ label, value, tone = 'default' }) {
  return (
    <div
      className={[
        'min-w-0 rounded-lg border p-3',
        tone === 'success'
          ? 'border-emerald-200 bg-emerald-50'
          : tone === 'danger'
            ? 'border-danger/30 bg-danger/10'
            : 'border-border-default bg-surface-page',
      ].join(' ')}
    >
      <dt className="text-role-helper text-text-secondary">{label}</dt>
      <dd className="mt-1 text-xl font-bold tabular-nums text-text-primary">
        {value.toLocaleString('en-US')}
      </dd>
    </div>
  )
}

function LeadImportSummary({
  phase,
  summary,
  issues,
}) {
  const status = phaseStatus[phase] ?? phaseStatus.empty
  const isValidating = phase === 'validation-validating'

  return (
    <Card aria-labelledby="lead-import-summary-title" className="min-w-0">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle id="lead-import-summary-title">
            Import summary
          </CardTitle>
          <CardDescription>
            Simulated validation totals for this frontend prototype.
          </CardDescription>
        </div>
        {phase !== 'success' && (
          <StatusIndicator label={status.label} tone={status.tone} />
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        {isValidating ? (
          <LoadingState
            label="Validating simulated lead rows…"
            announce={false}
          />
        ) : summary ? (
          <dl className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <SummaryCount label="Total rows" value={summary.totalRows} />
            <SummaryCount
              label="Valid rows"
              value={summary.validRows}
              tone="success"
            />
            <SummaryCount
              label="Error rows"
              value={summary.errorRows}
              tone="danger"
            />
          </dl>
        ) : (
          <p className="text-role-helper text-text-secondary">
            Totals will appear after a valid file is selected and its
            column mappings are complete.
          </p>
        )}

        {summary && (
          <section aria-labelledby="lead-validation-issues-title">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3
                id="lead-validation-issues-title"
                className="font-semibold text-text-primary"
              >
                Validation issues
              </h3>
              <Badge
                variant={issues.length > 0 ? 'danger' : 'success'}
                size="small"
              >
                {issues.length} shown
              </Badge>
            </div>

            {issues.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {issues.map((issue) => (
                  <li
                    key={issue.id}
                    className="min-w-0 rounded-lg border border-danger/20 bg-danger/5 p-2.5"
                  >
                    <div className="flex min-w-0 items-start gap-2">
                      <CircleX
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-danger"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="flex flex-wrap gap-x-2 text-role-helper font-semibold text-text-primary">
                            <span>Row {issue.rowNumber}</span>
                            <span
                              aria-hidden="true"
                              className="text-text-secondary"
                            >
                              ·
                            </span>
                            <span className="break-all">
                              {issue.sourceColumn}
                            </span>
                          </p>
                          <Badge variant="danger" size="small">
                            Error
                          </Badge>
                        </div>
                        <p className="mt-0.5 break-words text-role-helper text-text-secondary">
                          {issue.message}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <CircleCheck
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-emerald-700"
                />
                <p className="text-role-helper text-text-primary">
                  No validation issues were found in the simulated rows.
                </p>
              </div>
            )}
          </section>
        )}

        <aside className="flex items-start gap-3 rounded-lg bg-surface-page p-3">
          <Info
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-brand-secondary"
          />
          <p className="text-role-helper text-text-secondary">
            Imports are processed in the background in the production
            workflow. This prototype simulates that process locally.
          </p>
        </aside>
      </CardContent>
    </Card>
  )
}

export default LeadImportSummary
