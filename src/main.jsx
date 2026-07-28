/**
 * Browser entry point for the PowerDialer frontend.
 *
 * Creates the React root, establishes application-wide services, and mounts
 * the router so every routed screen can access those services.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from './app/router/index.jsx'
import { ToastProvider } from './components/ui/ToastProvider.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  // StrictMode exposes unsafe side effects during development without changing
  // the production UI. Provider order makes global services available to routes.
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
