import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [token, setToken] = useState("");
  const [pass, setPass] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(false);
  const [reset, setReset] = useState(false);
  const buttonDisabled = pass.newPassword !== pass.confirmPassword;
  const handleResetPassword = async () => {
    try {
      await axios.post("/api/users/forgot-password", {
        token,
        newPassword: pass.newPassword,
      });
      setReset(true);
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
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, [token]);
  return (
    <div className="flex items-center min-h-[calc(100vh-64px)] justify-center">
      <form className="rounded-md border shadow-2xl w-[50%]">
        <h1 className="text-center text-2xl text-green-700">Reset Password</h1>
        <div className="flex flex-col text-center">
          <Input
            type="password"
            placeholder="Enter new Password"
            name="newPassword"
            required
            onChange={(e) => setPass({ ...pass, newPassword: e.target.value })}
          />
          <Input
            type="password"
            name="newPassword"
            required
            onChange={(e) =>
              setPass({ ...pass, confirmPassword: e.target.value })
            }
            placeholder="Re-Enter new password"
          />
        </div>
        <button
          disabled={buttonDisabled}
          className="py-2 px-4 rounded-md bg-green-400"
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default page;
