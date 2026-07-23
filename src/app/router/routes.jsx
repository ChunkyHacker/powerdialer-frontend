import { Navigate } from 'react-router'
import AppLayout from '../layouts/AppLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import LoginPage from '../../features/auth/pages/LoginPage.jsx'
import DashboardPage from '../../features/dashboard/pages/DashboardPage.jsx'
import CampaignsPage from '../../features/campaigns/pages/CampaignsPage.jsx'
import LeadListsPage from '../../features/lead-lists/pages/LeadListsPage.jsx'
import LeadsPage from '../../features/leads/pages/LeadsPage.jsx'
import DialerPage from '../../features/dialer/pages/DialerPage.jsx'
import CallbacksPage from '../../features/callbacks/pages/CallbacksPage.jsx'
import CallLogsPage from '../../features/call-logs/pages/CallLogsPage.jsx'
import RecordingsPage from '../../features/recordings/pages/RecordingsPage.jsx'
import ReportsPage from '../../features/reports/pages/ReportsPage.jsx'
import AgentsPage from '../../features/agents/pages/AgentsPage.jsx'
import DncPage from '../../features/dnc/pages/DncPage.jsx'
import SettingsPage from '../../features/settings/pages/SettingsPage.jsx'
import NotFoundPage from '../../features/errors/pages/NotFoundPage.jsx'
import { defaultHeaderSearchPlaceholder } from '../../constants/headerSearchPlaceholders.js'
import ProtectedRoute from './ProtectedRoute.jsx'

function createRouteHandle(title, searchPlaceholder = defaultHeaderSearchPlaceholder) {
  return {
    title,
    breadcrumb: title,
    searchPlaceholder,
  }
}

export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
        handle: createRouteHandle('Login'),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
            handle: createRouteHandle('Dashboard'),
          },
          {
            path: '/campaigns',
            element: <CampaignsPage />,
            handle: createRouteHandle('Campaigns', 'Search campaigns'),
          },
          {
            path: '/lead-lists',
            element: <LeadListsPage />,
            handle: createRouteHandle('Lead Lists'),
          },
          {
            path: '/leads',
            element: <LeadsPage />,
            handle: createRouteHandle('Leads', 'Search leads'),
          },
          {
            path: '/dialer',
            element: <DialerPage />,
            handle: createRouteHandle('Dialer'),
          },
          {
            path: '/callbacks',
            element: <CallbacksPage />,
            handle: createRouteHandle('Callbacks', 'Search callbacks'),
          },
          {
            path: '/call-logs',
            element: <CallLogsPage />,
            handle: createRouteHandle('Call Logs'),
          },
          {
            path: '/recordings',
            element: <RecordingsPage />,
            handle: createRouteHandle('Recordings'),
          },
          {
            path: '/reports',
            element: <ReportsPage />,
            handle: createRouteHandle('Reports', 'Search reports'),
          },
          {
            path: '/agents',
            element: <AgentsPage />,
            handle: createRouteHandle('Agents'),
          },
          {
            path: '/dnc',
            element: <DncPage />,
            handle: createRouteHandle('DNC'),
          },
          {
            path: '/settings',
            element: <SettingsPage />,
            handle: createRouteHandle('Settings', 'Search settings'),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
    handle: createRouteHandle('Page Not Found'),
  },
]
