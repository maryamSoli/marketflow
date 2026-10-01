import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  ThemeProvider,
  CssBaseline,
} from '@mui/material'
import { store } from './store/store'
import theme from './theme/theme'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(
  document.getElementById('root'),
).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>

        <ReactQueryDevtools
          initialIsOpen={false}
        />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)