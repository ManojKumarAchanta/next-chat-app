"use client";

import toast from "react-hot-toast";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/users/signup", formData);
      console.log(data);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message);
      console.log("Signup failed ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      formData.email.length > 0 &&
      formData.password.length > 0 &&
      formData.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [formData]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg border bg-card text-card-foreground shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        <form className="space-y-4" onSubmit={onSignup}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full p-2 border bg-background rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full p-2 border bg-background rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="password"
              name="password"
              className="mt-1 block w-full p-2 border bg-background rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={buttonDisabled}
            className="cursor-pointer bg-blue-500 w-full font-semibold py-2 px-4 text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring"
          >
            {loading ? (
              <>
                Signing Up...
                <svg
                  className="animate-spin h-5 w-5 inline-block ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                  ></path>
                </svg>
              </>
            ) : (
              "Signup"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className=" text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
