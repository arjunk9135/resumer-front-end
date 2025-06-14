import React, { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";

export default function VerifyEmailPage() {
  const clerk = useClerk();
  const [verificationStatus, setVerificationStatus] = useState("loading");

  useEffect(() => {
    async function verifyEmail() {
      try {
        await clerk.handleEmailLinkVerification({
          redirectUrl: "/dashboard",
          redirectUrlComplete: "/dashboard",
        });
        setVerificationStatus("success");
      } catch (error) {
        console.error("Email verification failed:", error);
        setVerificationStatus("error");
      }
    }

    verifyEmail();
  }, [clerk]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {verificationStatus === "loading" && (
          <p className="text-lg font-medium text-gray-700">
            Verifying your email...
          </p>
        )}
        {verificationStatus === "success" && (
          <p className="text-lg font-medium text-green-600">
            Email verified successfully! Redirecting...
          </p>
        )}
        {verificationStatus === "error" && (
          <p className="text-lg font-medium text-red-600">
            Email verification failed. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}