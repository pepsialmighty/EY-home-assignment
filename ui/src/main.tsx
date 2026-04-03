import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider, type PersistedClient } from '@tanstack/react-query-persist-client'
import App from './App.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import './index.css'

const HOUR_MS = 1000 * 60 * 60

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,          // Always refetch from server in the background
      gcTime: HOUR_MS,       // Match maxAge — don't keep in-memory cache longer than the persisted one
    },
  },
})

const persister = {
  persistClient: (client: PersistedClient) => {
    try {
      localStorage.setItem('rq-cache', JSON.stringify(client))
    } catch {
      // Silently ignore — storage quota exceeded or private browsing restriction
    }
  },
  restoreClient: (): PersistedClient | undefined => {
    try {
      const raw = localStorage.getItem('rq-cache')
      return raw ? (JSON.parse(raw) as PersistedClient) : undefined
    } catch {
      // Corrupted cache — discard and start fresh
      localStorage.removeItem('rq-cache')
      return undefined
    }
  },
  removeClient: () => localStorage.removeItem('rq-cache'),
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: HOUR_MS }}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
)
