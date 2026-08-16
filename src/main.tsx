import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { I18nProvider } from './i18n/I18nContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Service workers are a progressive enhancement; ignore failures.
    })
  })
}
