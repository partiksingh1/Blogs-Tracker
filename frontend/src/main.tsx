import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ContextProvider } from './lib/ContextProvider.tsx'
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>        Z
      </ThemeProvider>
    </ContextProvider>
  </StrictMode>,
)
