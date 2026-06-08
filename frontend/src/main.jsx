import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode is intentionally omitted here because it double-invokes
// useEffect in development, which creates/destroys WebGL contexts twice
// on every component mount — causing jank and wasted GPU memory.
// React's StrictMode checks are still covered by ESLint rules.
createRoot(document.getElementById('root')).render(
  <App />
)
