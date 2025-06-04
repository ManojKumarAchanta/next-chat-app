"use client";

import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { get } from "http";
export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/users/logout");
      console.log("Logout success", data);
      if (data.success) {
        toast.success(data.message);
        router.push("/login"); // Redirect to login page
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };
  const getUserDetails = async () => {
    try {
      const { data } = await axios.get("/api/users/me");
      console.log("User details", data.data);
      setData(data.data);
      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to fetch user details");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await getUserDetails();
    };

    fetchData();
  }, []);
  return (
    <div className="flex h-screen  items-center justify-center ">
      <div className="w-full flex flex-col gap-8 max-w-sm p-6  rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Profile </h2>
        <div className="mb-4 flex-col gap-8 w-full">
          <h2 className="p-1 rounded mb-6 text-center bg-green-500 m-auto">
            Details
          </h2>
          {loading ? "Loading..." : "User Details"}
          <div className="text-center space-y-2">
            <p>
              <strong>Username:</strong> {data.username}
            </p>
            <p>
              <strong>Email:</strong> {data.email}
            </p>
            <p>
              <strong>Verified:</strong> {data.isVerified ? "Yes" : "No"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-md bg-white text-black px-4 py-2 cursor-pointer hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
