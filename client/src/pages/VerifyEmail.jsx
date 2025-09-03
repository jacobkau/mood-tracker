import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("Invalid verification link");
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email?token=${token}&email=${email}`
        );
        toast.success(res.data.message || "Email verified successfully!");
        setStatus("Success! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus(
          err.response?.data?.error || "Verification failed. Please try again."
        );
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-bold mb-4">Email Verification</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}
