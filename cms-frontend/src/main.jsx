
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './App/store.js'
import { Toaster } from 'react-hot-toast'
import {Provider} from 'react-redux';

createRoot(document.getElementById('root')).render(
  <Provider  store={store}>
    <App/>
    <Toaster position='top-right'/>
  </Provider>
)
