import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export function VerificationCodeInput() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || ""; // Fallback to empty string

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.verifyEmail({ 
        email: email as string, // Type assertion
        verificationCode: code 
      });
      toast.success("Email verified!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Verification Code</h1>
            <p className="text-muted-foreground">
              Please enter the verification code sent to your email.
            </p>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <InputOTP maxLength={6} id="verification-code" value={code} onChange={(value) => setCode(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button className="w-full" type="submit">
            Verify
          </Button>
        </div>
      </div>
    </form>
  );
}