import { BrowserRouter, Routes, Route } from 'react-router';
import Index from '@/routes/Index';
import Component from '@/components/ui/logInDemo'


export default function App() {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/" element={<Component />} />
            </Routes>
        </BrowserRouter>
    </>;
}