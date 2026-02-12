import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ContextProvider } from './lib/ContextProvider.tsx'
import { SearchProvider } from './lib/SearchProvider.tsx'
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ContextProvider>
          <ThemeProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </ThemeProvider>
        </ContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
