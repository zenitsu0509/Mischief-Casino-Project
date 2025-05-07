
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove default margin from body
document.body.classList.add('m-0', 'p-0', 'box-border');

createRoot(document.getElementById("root")!).render(<App />);
