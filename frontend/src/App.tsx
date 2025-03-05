import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/routes/Index';
import { LoginDemo } from '@/components/LoginDemo';
import { SingupDemo } from '@/components/SingupDemo';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginDemo />} />
                <Route path="/singup" element={<SingupDemo />} />
            </Routes>
        </BrowserRouter>
    );
}