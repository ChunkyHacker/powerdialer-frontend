import Badge from '../../../components/ui/Badge.jsx'
import Card from '../../../components/ui/Card.jsx'
import CardContent from '../../../components/ui/CardContent.jsx'
import CardDescription from '../../../components/ui/CardDescription.jsx'
import CardHeader from '../../../components/ui/CardHeader.jsx'
import CardTitle from '../../../components/ui/CardTitle.jsx'
import Skeleton from '../../../components/ui/Skeleton.jsx'
import SkeletonAvatar from '../../../components/ui/SkeletonAvatar.jsx'
import SkeletonCard from '../../../components/ui/SkeletonCard.jsx'
import SkeletonTableRow from '../../../components/ui/SkeletonTableRow.jsx'
import SkeletonText from '../../../components/ui/SkeletonText.jsx'

const radiusPresets = ['none', 'sm', 'md', 'lg', 'xl', 'full']
const avatarSizes = ['xs', 'sm', 'md', 'lg', 'xl']

const standardColumns = [
  { width: '72%' },
  { width: '55%' },
  { width: '6rem', align: 'end' },
]

const alternateColumns = [
  { width: '10rem' },
  { width: '85%' },
  { width: '4rem', align: 'center' },
  { width: '65%', align: 'end' },
]

function ShowcaseSection({
  title,
  description,
  children,
  className = '',
}) {
  return (
    <section
      className={[
        'min-w-0 rounded-xl border border-border-default bg-surface-card p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mb-6">
        <h2 className="text-role-section-title">{title}</h2>
        {description && (
          <p className="mt-1 text-role-helper text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

function KpiSkeleton() {
  return (
    <SkeletonCard className="min-h-48">
      <div className="flex h-full min-w-0 flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-4">
          <Skeleton width="2.5rem" height="2.5rem" radius="lg" />
          <Skeleton width="4.5rem" height="1.5rem" radius="full" />
        </div>
        <div className="min-w-0">
          <Skeleton width="7rem" height="0.75rem" />
          <Skeleton
            width="9rem"
            height="2.5rem"
            className="mt-3"
          />
        </div>
      </div>
    </SkeletonCard>
  )
}

function LeadPanelSkeleton() {
  return (
    <SkeletonCard className="space-y-6">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonAvatar size="lg" />
          <SkeletonText
            lines={2}
            lineWidths={['9rem', '12rem']}
            height="0.75rem"
          />
        </div>
        <Skeleton width="5rem" height="1.5rem" radius="full" />
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={`lead-detail-${index}`}
            className="min-w-0 rounded-lg bg-surface-page p-3"
          >
            <SkeletonText
              lines={2}
              lineWidths={['45%', '78%']}
              height="0.625rem"
              gap="0.5rem"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-border-default pt-4">
        <Skeleton width="6rem" height="2.5rem" radius="lg" />
        <Skeleton width="7.5rem" height="2.5rem" radius="lg" />
      </div>
    </SkeletonCard>
  )
}

function CallbackSkeleton() {
  return (
    <SkeletonCard className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SkeletonText
          lines={2}
          lineWidths={['10rem', '15rem']}
        />
        <Skeleton width="6rem" height="1.5rem" radius="full" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={`callback-row-${index}`}
            className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-border-default bg-surface-page px-4 py-3"
          >
            <SkeletonText
              lines={2}
              lineWidths={['8.5rem', '10rem']}
              height="0.75rem"
            />
            <Skeleton width="4.5rem" height="1.25rem" radius="full" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  )
}

function SettingsSectionSkeleton() {
  return (
    <SkeletonCard className="space-y-6">
      <SkeletonText
        lines={2}
        lineWidths={['11rem', '75%']}
        height="0.75rem"
      />

      <div className="space-y-5">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={`settings-field-${index}`} className="space-y-2">
            <Skeleton width="7rem" height="0.75rem" />
            <Skeleton width="100%" height="2.5rem" radius="lg" />
            <Skeleton width="60%" height="0.625rem" />
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-border-default pt-4">
        <Skeleton width="7rem" height="2.5rem" radius="lg" />
      </div>
    </SkeletonCard>
  )
}

function LayoutComparison() {
  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-2">
      <SkeletonCard className="min-h-64">
        <div className="flex h-full flex-col gap-5">
          <div className="flex items-center gap-3">
            <SkeletonAvatar size="lg" />
            <SkeletonText
              lines={2}
              lineWidths={['9rem', '12rem']}
            />
          </div>
          <SkeletonText lines={3} />
          <div className="mt-auto flex flex-wrap gap-3 border-t border-border-default pt-4">
            <Skeleton width="6rem" height="2.5rem" radius="lg" />
            <Skeleton width="7rem" height="2.5rem" radius="lg" />
          </div>
        </div>
      </SkeletonCard>

      <Card as="div" className="min-h-64">
        <CardContent className="flex h-full flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary font-semibold text-surface-card">
              AJ
            </span>
            <div>
              <p className="text-role-navigation">Avery Johnson</p>
              <p className="text-role-helper text-text-secondary">
                Enterprise lead
              </p>
            </div>
          </div>
          <p className="text-role-body-copy text-text-secondary">
            Interested in a follow-up conversation about the sales
            workflow and reporting options.
          </p>
          <div className="mt-auto flex flex-wrap gap-3 border-t border-border-default pt-4">
            <span className="flex h-control-md items-center rounded-lg border border-border-default px-4 text-role-navigation">
              Dismiss
            </span>
            <span className="flex h-control-md items-center rounded-lg bg-brand-primary px-4 text-role-navigation text-surface-card">
              Call lead
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="min-w-0 space-y-8">
      <div>
        <p className="text-role-table-heading uppercase text-text-secondary">
          Temporary visual QA
        </p>
        <h1 className="mt-1 text-role-page-title">Skeleton system</h1>
        <p className="mt-2 max-w-3xl text-role-body-copy text-text-secondary">
          Review primitive geometry, composed loading states,
          accessibility ownership, and loaded-layout alignment.
        </p>
      </div>

      <ShowcaseSection
        title="Base blocks"
        description="Dimensions, every radius preset, pulse/static modes, and a contextual dark-surface treatment."
      >
        <div className="space-y-6">
          <div className="flex min-w-0 flex-wrap items-end gap-4">
            <Skeleton width={120} height={24} />
            <Skeleton width="50%" height="1.5rem" />
            <Skeleton
              width="clamp(8rem, 30vw, 18rem)"
              height="2.5rem"
              radius="lg"
            />
            <Skeleton width="8ch" height="3rem" radius="xl" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {radiusPresets.map((radius) => (
              <div key={radius} className="min-w-0">
                <p className="mb-2 text-role-helper text-text-secondary">
                  {radius}
                </p>
                <Skeleton width="100%" height="2rem" radius={radius} />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-surface-page p-4">
              <p className="mb-3 text-role-helper text-text-secondary">
                Pulse
              </p>
              <Skeleton width="100%" height="1.25rem" />
            </div>
            <div className="rounded-lg bg-surface-page p-4">
              <p className="mb-3 text-role-helper text-text-secondary">
                Static / reduced-motion comparison
              </p>
              <Skeleton
                width="100%"
                height="1.25rem"
                animation="none"
              />
            </div>
          </div>

          <div className="rounded-xl bg-brand-primary p-5 text-surface-card">
            <p className="mb-3 text-role-helper">
              Contextual dark brand surface
            </p>
            <Skeleton
              width="75%"
              height="1rem"
              className="bg-surface-card/20"
            />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Text and avatars"
        description="Deterministic line widths, custom final lines, explicit per-line widths, and all Avatar-aligned sizes."
      >
        <div className="grid min-w-0 gap-8 xl:grid-cols-2">
          <div className="min-w-0 space-y-6">
            <SkeletonText lines={1} width="65%" />
            <SkeletonText lines={3} />
            <SkeletonText
              lines={4}
              width="90%"
              lastLineWidth="40%"
            />
            <SkeletonText
              lines={3}
              lineWidths={['100%', '82%', '55%']}
              height="1rem"
              gap="0.75rem"
            />
            <div className="w-full max-w-64 rounded-lg border border-border-default p-4">
              <p className="mb-3 text-role-helper text-text-secondary">
                Narrow container
              </p>
              <SkeletonText lines={4} />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-6">
            {avatarSizes.map((size) => (
              <div key={size} className="text-center">
                <SkeletonAvatar size={size} />
                <p className="mt-2 text-role-helper text-text-secondary">
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Card spacing"
        description="Structural wrappers with standard and compact padding."
      >
        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <SkeletonCard className="space-y-5">
            <SkeletonText lines={2} />
            <Skeleton height="6rem" width="100%" radius="lg" />
          </SkeletonCard>
          <SkeletonCard compact className="space-y-3">
            <SkeletonText lines={2} gap="0.375rem" />
            <Skeleton height="4rem" width="100%" radius="lg" />
          </SkeletonCard>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Semantic table rows"
        description="Standard and dense rows, optional selection/action columns, and caller-controlled column widths."
      >
        <div className="min-w-0 overflow-hidden rounded-xl border border-border-default">
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse bg-surface-card">
              <tbody>
                <SkeletonTableRow
                  columns={standardColumns}
                  selection
                  actions
                />
                <SkeletonTableRow
                  columns={standardColumns}
                  selection
                  actions
                />
                <SkeletonTableRow
                  columns={alternateColumns}
                  cellHeight="0.75rem"
                  cellClassName="py-2"
                  actions
                />
              </tbody>
            </table>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Local composition demonstrations"
        description="Feature-specific arrangements remain local rather than becoming base Skeleton variants."
      >
        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <div className="min-w-0">
            <p className="mb-3 text-role-navigation">KPI card</p>
            <KpiSkeleton />
          </div>
          <div className="min-w-0">
            <p className="mb-3 text-role-navigation">
              Lead panel concept (non-canonical)
            </p>
            <LeadPanelSkeleton />
          </div>
          <div className="min-w-0">
            <p className="mb-3 text-role-navigation">
              Callback card geometry
            </p>
            <CallbackSkeleton />
          </div>
          <div className="min-w-0">
            <p className="mb-3 text-role-navigation">
              Settings section
            </p>
            <SettingsSectionSkeleton />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Accessibility ownership"
        description="The parent is busy, one hidden status announces the context, and every Skeleton descendant is decorative."
      >
        <div
          aria-busy="true"
          className="rounded-xl border border-border-default bg-surface-page p-5"
        >
          <p className="sr-only" role="status" aria-live="polite">
            Loading settings preview
          </p>
          <SettingsSectionSkeleton />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Skeleton versus loaded layout"
        description="Both cards intentionally share minimum height, padding, spacing, avatar size, and action geometry."
      >
        <LayoutComparison />
      </ShowcaseSection>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>QA notes</CardTitle>
            <CardDescription>
              This temporary page is intentionally retained for manual
              review.
            </CardDescription>
          </div>
          <Badge variant="accent">Temporary showcase</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-role-helper text-text-secondary">
            Verify pulse behavior, OS reduced-motion behavior,
            horizontal table scrolling, narrow stacking, and the single
            loading announcement before cleanup is requested.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage
