"use client";
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ThemeSwitch";
import toast from "react-hot-toast";
import axios from "axios";
function DesktopNavbar() {
  // console.log("user: ",user)
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      if (res.data.success) {
        toast.success("Successfully logged out");
      }
      router.push("/login");
    } catch (error: any) {
      toast.error("Failed to logout" + error);
      console.log(error);
    }
  };
  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        className="cursor-pointer"
        onClick={() => {
          router.push("/signup");
        }}
      >
        Signup
      </Button>
      <Button
        className="cursor-pointer"
        onClick={() => {
          router.push("/login");
        }}
      >
        Login
      </Button>
      <Button className="cursor-pointer" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
export default DesktopNavbar;
