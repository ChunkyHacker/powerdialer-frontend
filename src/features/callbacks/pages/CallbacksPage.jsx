import { useState } from 'react'
import { CalendarClock, ListChecks } from 'lucide-react'
import Badge from '../../../components/ui/Badge.jsx'
import Card from '../../../components/ui/Card.jsx'
import CardContent from '../../../components/ui/CardContent.jsx'
import CardDescription from '../../../components/ui/CardDescription.jsx'
import CardHeader from '../../../components/ui/CardHeader.jsx'
import CardTitle from '../../../components/ui/CardTitle.jsx'
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
} from '../../../components/ui/Tabs.jsx'

const callbackItems = [
  { contact: 'Avery Johnson', time: 'Today, 10:30 AM', priority: 'High' },
  { contact: 'Morgan Lee', time: 'Today, 2:15 PM', priority: 'Standard' },
  { contact: 'Taylor Smith', time: 'Tomorrow, 9:00 AM', priority: 'Standard' },
]

function CallbacksPage() {
  const [activeView, setActiveView] = useState('list')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-role-page-title">Callbacks</h1>
        <p className="mt-1 text-role-body-copy text-text-secondary">
          Review upcoming conversations in the view that works best for you.
        </p>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList aria-label="Callback view">
          <TabsTrigger value="list">
            <ListChecks aria-hidden="true" />
            <span>List View</span>
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarClock aria-hidden="true" />
            <span>Calendar View</span>
          </TabsTrigger>
        </TabsList>

        <TabsPanel value="list">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Upcoming callbacks</CardTitle>
                <CardDescription>
                  A lightweight preview of the callback queue.
                </CardDescription>
              </div>
              <Badge variant="accent">{callbackItems.length} scheduled</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {callbackItems.map((callback) => (
                <div
                  key={`${callback.contact}-${callback.time}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-default bg-surface-page px-4 py-3"
                >
                  <div>
                    <p className="text-role-navigation text-text-primary">
                      {callback.contact}
                    </p>
                    <p className="text-role-helper text-text-secondary">
                      {callback.time}
                    </p>
                  </div>
                  <Badge
                    variant={callback.priority === 'High' ? 'warning' : 'neutral'}
                    size="small"
                  >
                    {callback.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsPanel>

        <TabsPanel value="calendar">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Calendar preview</CardTitle>
                <CardDescription>
                  Scheduled callbacks grouped into a simple date summary.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border-default bg-surface-page p-4">
                  <p className="text-role-navigation text-text-primary">Today</p>
                  <p className="mt-1 text-role-helper text-text-secondary">
                    2 scheduled callbacks
                  </p>
                </div>
                <div className="rounded-lg border border-border-default bg-surface-page p-4">
                  <p className="text-role-navigation text-text-primary">
                    Tomorrow
                  </p>
                  <p className="mt-1 text-role-helper text-text-secondary">
                    1 scheduled callback
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsPanel>
      </Tabs>
    </div>
  )
}

export default CallbacksPage
