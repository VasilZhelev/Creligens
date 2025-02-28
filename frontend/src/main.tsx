import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {HeroUIProvider} from "@heroui/react";
import App from '@/App';
import '@/style/global.css'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
        <App />
    </HeroUIProvider>
  </StrictMode>
)
