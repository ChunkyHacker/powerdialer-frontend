import { Navigate } from 'react-router'
import AppLayout from '../layouts/AppLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import LoginPage from '../../features/auth/pages/LoginPage.jsx'
import DashboardPage from '../../features/dashboard/pages/DashboardPage.jsx'
import NotFoundPage from '../../features/errors/pages/NotFoundPage.jsx'

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
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
