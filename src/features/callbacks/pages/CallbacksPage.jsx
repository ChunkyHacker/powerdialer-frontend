import { useMemo, useRef, useState } from 'react'
import { CalendarClock, ListChecks, Plus } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'
import Card from '../../../components/ui/Card.jsx'
import CardContent from '../../../components/ui/CardContent.jsx'
import CardDescription from '../../../components/ui/CardDescription.jsx'
import CardHeader from '../../../components/ui/CardHeader.jsx'
import CardTitle from '../../../components/ui/CardTitle.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
} from '../../../components/ui/Tabs.jsx'
import { useToast } from '../../../contexts/ToastContext.js'
import CallbacksBoard from '../components/CallbacksBoard.jsx'
import RescheduleCallbackDialog from '../components/RescheduleCallbackDialog.jsx'
import { CALLBACK_REFERENCE_DATE } from '../data/mockCallbackData.js'
import { useCallbacksData } from '../hooks/useCallbacksData.js'
import {
  formatCallbackSchedule,
  getCallbackCounts,
  groupCallbacks,
} from '../utils/callbackGrouping.js'

function createBoardAnnouncement(action, counts) {
  return `${action} ${counts.overdue} overdue, ${counts.dueToday} due today, ${counts.completed} completed.`
}

function CallbacksPage() {
  const {
    callbacks,
    agents,
    isLoading,
    loadError,
    retry,
    pendingActions,
    rescheduleCallback,
    completeCallback,
  } = useCallbacksData()
  const { success, error, info } = useToast()
  const boardHeadingRef = useRef(null)
  const [activeView, setActiveView] = useState('list')
  const [rescheduleCallbackId, setRescheduleCallbackId] = useState(null)
  const [announcement, setAnnouncement] = useState('')

  const groups = useMemo(() => groupCallbacks(callbacks), [callbacks])
  const counts = useMemo(() => getCallbackCounts(groups), [groups])
  const selectedCallback =
    callbacks.find((callback) => callback.id === rescheduleCallbackId) ?? null
  const reschedulePending =
    selectedCallback && pendingActions[selectedCallback.id] === 'reschedule'

  function focusBoardHeading() {
    requestAnimationFrame(() => {
      boardHeadingRef.current?.focus({ preventScroll: true })
    })
  }

  function getCountsAfterPatch(callbackId, patch) {
    const nextCallbacks = callbacks.map((callback) =>
      callback.id === callbackId ? { ...callback, ...patch } : callback,
    )
    return getCallbackCounts(groupCallbacks(nextCallbacks))
  }

  function handleNewCallback() {
    info('Callback creation is prepared for a later scheduling form.', {
      id: 'new-callback-placeholder',
      title: 'New Callback',
    })
  }

  function handleCallNow(callback) {
    info(
      `Dialer handoff for ${callback.contactName} will be available when the Dialer workflow is implemented.`,
      {
        id: `callback-call-${callback.id}`,
        title: 'Call Now',
      },
    )
  }

  function handleViewDetails(callback) {
    info(`Details for ${callback.contactName} will be available in a future step.`, {
      id: `callback-details-${callback.id}`,
      title: 'Callback Details',
    })
  }

  async function handleComplete(callback) {
    try {
      const patch = await completeCallback(callback.id)
      const nextCounts = getCountsAfterPatch(callback.id, patch)
      setAnnouncement(createBoardAnnouncement('Callback completed.', nextCounts))
      success(`${callback.contactName} was marked completed.`, {
        id: `callback-complete-${callback.id}`,
        title: 'Callback completed',
      })
      focusBoardHeading()
    } catch (requestError) {
      if (requestError?.name !== 'AbortError') {
        error('The callback could not be marked completed. Please try again.', {
          id: `callback-complete-error-${callback.id}`,
          title: 'Callback update failed',
        })
      }
    }
  }

  async function handleReschedule(scheduledAt) {
    if (!selectedCallback) {
      return
    }

    try {
      const patch = await rescheduleCallback(selectedCallback.id, scheduledAt)
      const nextCallbacks = callbacks.map((callback) =>
        callback.id === selectedCallback.id
          ? { ...callback, ...patch }
          : callback,
      )
      const nextGroups = groupCallbacks(nextCallbacks)
      const nextCounts = getCallbackCounts(nextGroups)
      const movedToUpcoming = nextGroups.upcoming.some(
        (callback) => callback.id === selectedCallback.id,
      )
      const schedule = formatCallbackSchedule(scheduledAt)

      setAnnouncement(
        createBoardAnnouncement('Callback rescheduled.', nextCounts),
      )
      setRescheduleCallbackId(null)
      success(
        movedToUpcoming
          ? `${selectedCallback.contactName} was moved to an upcoming date: ${schedule.date} at ${schedule.time}.`
          : `${selectedCallback.contactName} was rescheduled for ${schedule.date} at ${schedule.time}.`,
        {
          id: `callback-reschedule-${selectedCallback.id}`,
          title: movedToUpcoming ? 'Moved to upcoming' : 'Callback rescheduled',
        },
      )
      focusBoardHeading()
    } catch (requestError) {
      if (requestError?.name !== 'AbortError') {
        error('The callback could not be rescheduled. Please try again.', {
          id: `callback-reschedule-error-${selectedCallback.id}`,
          title: 'Reschedule failed',
        })
      }
      throw requestError
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-role-page-title">Callbacks</h1>
          <p className="mt-1 text-role-body-copy text-text-secondary">
            Review scheduled conversations and keep every follow-up on track.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          icon={Plus}
          className="self-start sm:self-auto"
          onClick={handleNewCallback}
        >
          New Callback
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList aria-label="Callback view">
          <TabsTrigger value="list">
            <ListChecks aria-hidden="true" />
            <span>List</span>
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarClock aria-hidden="true" />
            <span>Calendar</span>
          </TabsTrigger>
        </TabsList>

        <TabsPanel value="list">
          <CallbacksBoard
            callbacks={callbacks}
            groups={groups}
            agents={agents}
            isLoading={isLoading}
            loadError={loadError}
            pendingActions={pendingActions}
            announcement={announcement}
            boardHeadingRef={boardHeadingRef}
            onRetry={retry}
            onNewCallback={handleNewCallback}
            onCallNow={handleCallNow}
            onReschedule={(callback) => setRescheduleCallbackId(callback.id)}
            onViewDetails={handleViewDetails}
            onComplete={handleComplete}
          />
        </TabsPanel>

        <TabsPanel value="calendar">
          <Card aria-labelledby="callback-calendar-title" className="min-w-0">
            <CardHeader>
              <div className="min-w-0">
                <CardTitle id="callback-calendar-title">
                  Callback Calendar
                </CardTitle>
                <CardDescription>
                  A full calendar interface will be implemented in a later workflow.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingState label="Loading callback summary…" />
              ) : loadError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-danger/30 bg-danger/10 px-5 py-6"
                >
                  <p className="text-role-navigation font-semibold text-danger">
                    Callback summary could not be loaded.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={retry}>
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border-default bg-surface-page px-5 py-8 text-center sm:px-8">
                  <span
                    aria-hidden="true"
                    className="mx-auto flex size-12 items-center justify-center rounded-full bg-surface-card text-brand-secondary shadow-sm"
                  >
                    <CalendarClock className="size-6" />
                  </span>
                  <h2 className="mt-4 text-role-section-title text-text-primary">
                    Calendar view is coming later
                  </h2>
                  <p className="mx-auto mt-2 max-w-lg text-role-helper text-text-secondary">
                    Use the List view to manage callbacks now. Calendar navigation and scheduling will be added without changing the callback records.
                  </p>

                  <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ['Overdue', counts.overdue],
                      ['Due Today', counts.dueToday],
                      ['Completed', counts.completed],
                      ['Upcoming', counts.upcoming],
                    ].map(([label, count]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-border-default bg-surface-card p-3"
                      >
                        <p className="text-2xl font-semibold tabular-nums text-text-primary">
                          {count}
                        </p>
                        <p className="mt-1 text-role-helper text-text-secondary">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-role-helper text-text-secondary">
                    Mock schedule reference: {CALLBACK_REFERENCE_DATE} in Asia/Manila
                  </p>
                  <Button
                    variant="accent"
                    size="sm"
                    icon={Plus}
                    className="mt-5"
                    onClick={handleNewCallback}
                  >
                    New Callback
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsPanel>
      </Tabs>

      {selectedCallback && (
        <RescheduleCallbackDialog
          callback={selectedCallback}
          open
          pending={Boolean(reschedulePending)}
          restoreFocusRef={boardHeadingRef}
          onOpenChange={(open) => {
            if (!open && !reschedulePending) {
              setRescheduleCallbackId(null)
            }
          }}
          onSave={handleReschedule}
        />
      )}
    </div>
  )
}

export default CallbacksPage
