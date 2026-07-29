/**
 * Completes mock authentication and safely returns the user to the route that
 * originally required login.
 *
 * Destination validation is repeated here because navigation is the final
 * boundary before an untrusted route-state value is used.
 */
import { useEffect, useRef, useState } from 'react'
import {
  BarChart3,
  Headphones,
  PhoneCall,
  UsersRound,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import Button from '../../../components/ui/Button.jsx'
import Input from '../../../components/ui/Input.jsx'
import PasswordInput from '../../../components/ui/PasswordInput.jsx'
import { useAuth } from '../../../contexts/AuthContext.jsx'

function getSafeDestination(from) {
  if (
    typeof from?.pathname !== 'string' ||
    !from.pathname.startsWith('/') ||
    from.pathname.startsWith('//') ||
    from.pathname === '/login'
  ) {
    return '/dashboard'
  }

  return {
    pathname: from.pathname,
    search: typeof from.search === 'string' ? from.search : '',
    hash: typeof from.hash === 'string' ? from.hash : '',
  }
}

function GoogleMark({ className = '', ...markProps }) {
  return (
    <span
      {...markProps}
      className={[
        'flex items-center justify-center rounded-full border border-current text-xs font-semibold',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      G
    </span>
  )
}

function MicrosoftMark({ className = '', ...markProps }) {
  return (
    <span
      {...markProps}
      className={[
        'flex items-center justify-center rounded-sm border border-current text-xs font-semibold',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      M
    </span>
  )
}

function validateFields(email, password) {
  const errors = {}
  const normalizedEmail = email.trim()

  if (!normalizedEmail) {
    errors.email = 'Enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Enter your password.'
  }

  return errors
}

function LoginPage() {
  const { login, loginWithProvider } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const pendingRef = useRef(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [authenticationError, setAuthenticationError] = useState('')
  const [informationMessage, setInformationMessage] = useState('')
  const [pendingOperation, setPendingOperation] = useState(null)
  const isPending = pendingOperation !== null

  useEffect(() => {
    document.title = 'Login | PowerDialer'
  }, [])

  function clearFieldError(field) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  function beginAuthentication(operation) {
    if (pendingRef.current) {
      return false
    }

    pendingRef.current = true
    setPendingOperation(operation)
    setAuthenticationError('')
    setInformationMessage('')
    return true
  }

  function finishAuthentication() {
    pendingRef.current = false
    setPendingOperation(null)
  }

  async function runAuthentication(operation, authenticate) {
    if (!beginAuthentication(operation)) {
      return
    }

    try {
      await authenticate()
      finishAuthentication()
      navigate(getSafeDestination(location.state?.from), {
        replace: true,
      })
    } catch (error) {
      finishAuthentication()
      setAuthenticationError(
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.',
      )
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (pendingRef.current) {
      return
    }

    setAuthenticationError('')
    const errors = validateFields(email, password)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      if (errors.email) {
        emailRef.current?.focus()
      } else {
        passwordRef.current?.focus()
      }
      return
    }

    await runAuthentication('password', () =>
      login({ email, password, rememberMe }),
    )
  }

  function handleProviderLogin(provider) {
    runAuthentication(provider, () =>
      loginWithProvider(provider, { rememberMe }),
    )
  }

  function showMockInformation(message) {
    setInformationMessage(message)
  }

  function handleEmailChange(event) {
    setEmail(event.target.value)
    clearFieldError('email')
    setAuthenticationError('')
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value)
    clearFieldError('password')
    setAuthenticationError('')
  }

  return (
    <div className="grid min-h-dvh bg-surface-card lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="flex flex-col bg-brand-primary px-6 py-8 text-surface-card sm:px-10 lg:min-h-dvh lg:px-12 lg:py-10 xl:px-16 xl:py-14">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-xl bg-brand-accent text-brand-primary shadow-md"
          >
            <PhoneCall className="size-5" />
          </span>
          <span className="text-role-section-title">PowerDialer</span>
        </div>

        <div className="mt-10 max-w-lg lg:mt-16">
          <p className="text-role-helper font-semibold uppercase tracking-[0.16em] text-brand-accent">
            Sales conversations, focused
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Power every conversation.
          </h2>
          <p className="mt-4 text-role-body-copy text-surface-card/80">
            Connect with more leads, manage every call, and keep your
            sales workflow moving from one focused workspace.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="my-12 hidden max-w-lg flex-1 items-center lg:flex"
        >
          <div className="w-full rounded-2xl border border-surface-card/20 bg-surface-card/10 p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-surface-card/20 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-accent text-brand-primary">
                  <Headphones className="size-5" />
                </span>
                <div>
                  <div className="h-2.5 w-24 rounded-full bg-surface-card/80" />
                  <div className="mt-2 h-2 w-16 rounded-full bg-surface-card/30" />
                </div>
              </div>
              <span className="rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-brand-primary">
                Live call
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5">
              <div className="rounded-xl bg-brand-secondary p-4">
                <UsersRound className="size-5 text-brand-accent" />
                <div className="mt-5 h-3 w-12 rounded-full bg-surface-card/80" />
                <div className="mt-2 h-2 w-20 rounded-full bg-surface-card/30" />
              </div>
              <div className="rounded-xl bg-brand-secondary p-4">
                <BarChart3 className="size-5 text-brand-accent" />
                <div className="mt-5 flex h-8 items-end gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-brand-accent/40" />
                  <span className="h-5 w-3 rounded-sm bg-brand-accent/60" />
                  <span className="h-8 w-3 rounded-sm bg-brand-accent" />
                  <span className="h-6 w-3 rounded-sm bg-brand-accent/70" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-role-helper text-surface-card/60 lg:mt-auto">
          Privacy <span aria-hidden="true">·</span> Terms
        </p>
      </section>

      <section className="flex px-6 py-10 sm:px-10 sm:py-14 lg:min-h-dvh lg:items-center lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <p className="text-role-helper font-semibold uppercase tracking-[0.14em] text-brand-accent-hover">
            Welcome to your workspace
          </p>
          <h1 className="mt-2 text-role-page-title">Welcome back</h1>
          <p className="mt-2 text-role-body-copy text-text-secondary">
            Sign in to continue to PowerDialer.
          </p>

          <form
            className="mt-8 space-y-5"
            noValidate
            onSubmit={handleSubmit}
          >
            {authenticationError && (
              <div
                role="alert"
                className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger"
              >
                {authenticationError}
              </div>
            )}

            <Input
              ref={emailRef}
              id="login-email"
              label="Email address"
              type="email"
              name="email"
              autoComplete="username"
              inputMode="email"
              placeholder="you@company.com"
              value={email}
              error={fieldErrors.email}
              required
              disabled={isPending}
              onChange={handleEmailChange}
            />

            <PasswordInput
              ref={passwordRef}
              id="login-password"
              label="Password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              error={fieldErrors.password}
              required
              disabled={isPending}
              onChange={handlePasswordChange}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="login-remember"
                className="flex cursor-pointer items-center gap-2 text-role-helper text-text-primary"
              >
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={rememberMe}
                  disabled={isPending}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="size-4 cursor-pointer rounded border-border-default accent-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
                />
                Remember me
              </label>

              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  showMockInformation(
                    'Password recovery is not connected in this frontend mock.',
                  )
                }
                className="rounded-sm text-role-navigation text-brand-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              fullWidth
              disabled={isPending}
              isLoading={pendingOperation === 'password'}
            >
              {pendingOperation === 'password'
                ? 'Signing in'
                : 'Sign in'}
            </Button>
          </form>

          <div
            className="my-6 flex items-center gap-3"
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-border-default" />
            <span className="text-role-helper text-text-secondary">
              or
            </span>
            <span className="h-px flex-1 bg-border-default" />
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              icon={GoogleMark}
              fullWidth
              disabled={isPending}
              isLoading={pendingOperation === 'google'}
              onClick={() => handleProviderLogin('google')}
            >
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              icon={MicrosoftMark}
              fullWidth
              disabled={isPending}
              isLoading={pendingOperation === 'microsoft'}
              onClick={() => handleProviderLogin('microsoft')}
            >
              Continue with Microsoft
            </Button>
          </div>

          <p className="mt-6 text-center text-role-helper text-text-secondary">
            Need an account?{' '}
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                showMockInformation(
                  'Access requests are not connected in this frontend mock.',
                )
              }
              className="rounded-sm font-semibold text-brand-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Request access
            </button>
          </p>

          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-4 min-h-5 text-center text-role-helper text-text-secondary"
          >
            {informationMessage}
          </div>

          <aside className="mt-6 rounded-lg bg-surface-page px-4 py-3 text-role-helper text-text-secondary">
            <p className="font-semibold text-text-primary">
              Demo credentials
            </p>
            <p className="mt-1 break-all">demo@powerdialer.com</p>
            <p className="break-all">PowerDialer123!</p>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default LoginPage
