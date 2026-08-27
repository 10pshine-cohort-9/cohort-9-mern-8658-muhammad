"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/userContext";
import { User2 } from "lucide-react";
import { toast } from "./ui/toast";
import { Userlogout } from "@/lib/api/logout";
import { useRouter } from "next/navigation";

export function UserDropdown() {
  const router = useRouter();
  let { logout } = useUser();

  let handlelogout = async () => {
    const res = await Userlogout();
    if (res.success) {
      toast.add({
        title: "Logout",
        description: "Thank for using our platform",
      });
      logout();
      router.replace("/auth/login");
    } else {
      toast.add({
        type: "error",
        description: "Unable to Logout",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Open account menu"
            type="button"
            className="rounded-full flex h-10 w-10 justify-center items-center bg-gradient-to-br from-violet-500 to-sky-500"
          >
            <User2 className="size-4.5 font-bold text-white " />
          </button>
        }
      />
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handlelogout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
