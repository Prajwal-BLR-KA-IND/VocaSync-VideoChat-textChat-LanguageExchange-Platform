import { initTheme } from './utils/initTheme.js'
initTheme();

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "stream-chat-react/dist/css/v2/index.css"
import "./index.css";
import App from './App.jsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
)
