import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/routes/Index';
import { Component1 as LogInDemo } from '@/components/ui/logInDemo'; // Default import
import { Component as SingUpDemo } from '@/components/ui/singUpDemo'; // Named import

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LogInDemo />} /> {/* Route for LogInDemo */}
          <Route path="/signup" element={<SingUpDemo />} /> {/* Route for SingUpDemo */}
        </Routes>
      </BrowserRouter>
    </>
  );
}