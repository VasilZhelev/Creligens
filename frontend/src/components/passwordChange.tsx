"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Password Input Component
const PasswordInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2 min-w-[300px]">
      <Label htmlFor={id}>New Password</Label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter new password"
          required
          minLength={6}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-2 top-2.5"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

// Verification Code Input Component
const VerificationCodeInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2 flex flex-col items-center">
    <Label>Verification Code</Label>
    <InputOTP maxLength={6} value={value} onChange={onChange}>
      <InputOTPGroup>
        {[...Array(6)].map((_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  </div>
);

// Main Component
export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.resetPassword({ email, resetCode, newPassword });
      toast.success("Password reset!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Reset failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter the code sent to your email and new password
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <VerificationCodeInput
            value={resetCode}
            onChange={(val) => setResetCode(val)}
          />

          <PasswordInput
            value={newPassword}
            onChange={(val) => setNewPassword(val)}
          />

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </div>

        <div className="text-center text-sm">
          <Button
            variant="link"
            className="text-muted-foreground"
            onClick={() => navigate("/login")}
          >
            Remember your password? Login
          </Button>
        </div>
      </form>
    </div>
  );
}