"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const onLogin = async (e: any) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const { data } = await axios.post("/api/users/login", user);
      console.log("Login success", data);
      if (data.success) {
        toast.success(data.message);
        router.replace("/profile");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || error.message || "Login failed"
      );
      console.error(
        "Login failed",
        error.response?.data?.error || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg border bg-card text-card-foreground shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4" onSubmit={onLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={onChange}
              className="mt-1 block w-full p-2 border bg-background rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              onChange={onChange}
              className="mt-1 block w-full p-2 border bg-background rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full font-semibold py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            signup
          </Link>
        </p>
        <p>
          <Link href="/forgot-password">Forgot Password</Link>
        </p>
      </div>
    </div>
  );
}
