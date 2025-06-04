"use client";

import axios from "axios";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);
  return (
    <div>
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          {verified && (
            <div className="text-green-500 text-center">
              <h2 className="text-2xl font-bold mb-6">Email Verified</h2>
              <p>Your email has been verified successfully!</p>
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div> 
          )}
          {!token && (
            <div className="text-red-500 text-center">
              <h2 className="text-2xl font-bold mb-6">Error</h2>
              <p>Invalid or expired token. Please try again.</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Verify Email</h2>
          <p className="text-center">
            Please check your email for the verification link.
          </p>
        </div>
      </div>
    </div>
  );
}
