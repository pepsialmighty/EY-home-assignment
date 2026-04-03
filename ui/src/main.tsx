import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider, type PersistedClient } from '@tanstack/react-query-persist-client'
import App from './App.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep cache for 24 hours so localStorage persister has time to restore it
      gcTime: 1000 * 60 * 60 * 24,
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
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
)
