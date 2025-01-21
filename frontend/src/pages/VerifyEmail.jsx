import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useVerifyEmail } from "@/hooks/authHooks";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";

export const VerifyEmail = () => {
  const { token } = useParams();

  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  const { mutate: verifyEmail, isSuccess, isError, error } = useVerifyEmail();

  const handleVerify = () => {
    setIsVerifying(true);
    if (!token) {
      console.error("Token is missing or invalid.");
      return;
    }
    verifyEmail(token, {
      onSuccess: () => {
        showSuccessToast("account has been activated");
        navigate("/");
      },
      onerror: () => {
        const errorMessage =
          err?.response?.data?.message || "Verification failed.";
        showErrorToast(errorMessage);
      },
      onSettled: () => {
        setIsVerifying(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Click the button below to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSuccess ? (
            <>
              <Button
                onClick={handleVerify}
                className="w-full"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </Button>
              {isError && (
                <div className="flex items-center space-x-2 text-red-500">
                  <AlertCircle size={20} />
                  <span>
                    {error?.response?.data?.message || "Verification failed."}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-green-500 space-y-2">
              <CheckCircle2 size={50} className="mx-auto" />
              <p className="font-semibold">Account verified successfully!</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {isSuccess && (
            <a href="/login" className="text-sm text-blue-500 hover:underline">
              Proceed to Login
            </a>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
