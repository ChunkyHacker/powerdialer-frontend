const SESSION_KEY = 'powerdialer.mockSession'
const INVALID_CREDENTIALS_MESSAGE =
  'The email or password you entered is incorrect.'

const DEMO_CREDENTIALS = {
  email: 'demo@powerdialer.com',
  password: 'PowerDialer123!',
}

const supportedProviders = new Set(['google', 'microsoft'])

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

function createMockUser(provider) {
  return {
    id: 'demo-user',
    name: 'Demo Agent',
    email: DEMO_CREDENTIALS.email,
    role: 'agent',
    provider,
  }
}

function isValidMockUser(user) {
  return (
    user &&
    typeof user === 'object' &&
    user.id === 'demo-user' &&
    user.name === 'Demo Agent' &&
    user.email === DEMO_CREDENTIALS.email &&
    user.role === 'agent' &&
    ['password', ...supportedProviders].includes(user.provider)
  )
}

function getStorage(storageName) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window[storageName]
  } catch {
    return null
  }
}

function removeSession(storage) {
  try {
    storage?.removeItem(SESSION_KEY)
  } catch {
    // An unavailable storage mechanism should not block mock logout.
  }
}

function readSession(storage) {
  if (!storage) {
    return null
  }

  try {
    const serializedSession = storage.getItem(SESSION_KEY)

    if (!serializedSession) {
      return null
    }

    const session = JSON.parse(serializedSession)

    if (!isValidMockUser(session?.user)) {
      storage.removeItem(SESSION_KEY)
      return null
    }

    return createMockUser(session.user.provider)
  } catch {
    removeSession(storage)
    return null
  }
}

export async function authenticateWithPassword({ email, password }) {
  await wait(800)

  const normalizedEmail =
    typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (
    normalizedEmail !== DEMO_CREDENTIALS.email ||
    password !== DEMO_CREDENTIALS.password
  ) {
    throw new Error(INVALID_CREDENTIALS_MESSAGE)
  }

  return createMockUser('password')
}

export async function authenticateWithProvider(provider) {
  if (!supportedProviders.has(provider)) {
    throw new Error('This mock sign-in provider is not supported.')
  }

  await wait(700)
  return createMockUser(provider)
}

export function storeMockSession(user, rememberMe) {
  if (!isValidMockUser(user)) {
    throw new Error('The mock authentication session is invalid.')
  }

  const persistentStorage = getStorage('localStorage')
  const sessionStorage = getStorage('sessionStorage')
  const selectedStorage = rememberMe
    ? persistentStorage
    : sessionStorage

  removeSession(persistentStorage)
  removeSession(sessionStorage)
  const sanitizedUser = createMockUser(user.provider)
  selectedStorage?.setItem(
    SESSION_KEY,
    JSON.stringify({ user: sanitizedUser }),
  )
}

export function restoreMockSession() {
  const persistentSession = readSession(getStorage('localStorage'))

  if (persistentSession) {
    return persistentSession
  }

  return readSession(getStorage('sessionStorage'))
}

export function clearMockSession() {
  removeSession(getStorage('localStorage'))
  removeSession(getStorage('sessionStorage'))
}
