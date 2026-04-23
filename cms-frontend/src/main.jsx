
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './App/store.js'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position='top-right' richColors />
    </QueryClientProvider>
  </Provider>
)
