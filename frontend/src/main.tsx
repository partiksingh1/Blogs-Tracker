import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/dashboard/ThemeProvider.tsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ContextProvider } from './context/AuthContext.tsx'
import { SearchProvider } from './context/SearchContext.tsx'
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
