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
import ProtectedRoute from './ProtectedRoute.jsx'

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
          },
          {
            path: '/campaigns',
            element: <CampaignsPage />,
          },
          {
            path: '/lead-lists',
            element: <LeadListsPage />,
          },
          {
            path: '/leads',
            element: <LeadsPage />,
          },
          {
            path: '/dialer',
            element: <DialerPage />,
          },
          {
            path: '/callbacks',
            element: <CallbacksPage />,
          },
          {
            path: '/call-logs',
            element: <CallLogsPage />,
          },
          {
            path: '/recordings',
            element: <RecordingsPage />,
          },
          {
            path: '/reports',
            element: <ReportsPage />,
          },
          {
            path: '/agents',
            element: <AgentsPage />,
          },
          {
            path: '/dnc',
            element: <DncPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
