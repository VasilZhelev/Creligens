import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/routes/Index';
import { LoginDemo } from '@/components/LoginDemo';
import { SignupDemo } from '@/components/SignupDemo';
import { VerificationCodeInput } from '@/components/codeVerification';
import { ForgotPassword } from '@/components/passwordChange';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginDemo />} />
                <Route path="/singup" element={<SignupDemo />} />
                <Route path="/verify-email" element={<VerificationCodeInput />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
        </BrowserRouter>
    );
}