"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  StickyNote,
  Star,
  Archive,
  Activity,
  User,
  Settings,
  HelpCircle,
  Info,
  Plus,
  FileText,
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { useUser } from "@/context/userContext";
import { Userlogout } from "@/lib/api/logout";
import { toast } from "./ui/toast";

function Sidenavbar({ sideOpen, setSideOpen }) {
  const path = usePathname();

  let sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/app",
    },
    {
      title: "My Notes",
      icon: FileText,
      path: "/app/notes",
    },
    {
      title: "Favorites",
      icon: Star,
      path: "/app/favorites",
    },
    {
      title: "Archive",
      icon: Archive,
      path: "/app/archive",
    },

    {
      title: "Activity",
      icon: Activity,
      path: "/app/activity",
    },
  ];

  let sidebarBottomItems = [
    {
      title: "Profile",
      icon: User,
      path: "/app/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/app/settings",
    },
    {
      title: "Help Center",
      icon: HelpCircle,
      path: "/app/help",
    },
    {
      title: "About",
      icon: Info,
      path: "/app/about",
    },
  ];
  const [showText, setShowText] = useState(sideOpen);

  useEffect(() => {
    if (sideOpen) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 130);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [sideOpen]);

  let { logout } = useUser();

  let handlelogout = async () => {
    const res = await Userlogout();
    if (res.success) {
      toast.add({
        title: "Logout",
        description: "Thank for using our platform",
      });
      logout();
    } else {
      toast.add({
        type: "error",
        description: "Unable to Logout",
      });
    }
  };

  const isActive = (itemPath) => {
    if (itemPath === "/app") {
      return path === "/app";
    }

    return path === itemPath || path.startsWith(`${itemPath}/`);
  };
  return (
    <div
      className={`
  h-dvh flex flex-col
  bg-slate-50 border-r border-gray-200
  dark:bg-slate-950 dark:border-gray-800
  transition-all duration-300 ease-in-out
  overflow-hidden

  ${sideOpen ? "w-64" : "lg:w-20"}

  relative

  ${
    sideOpen
      ? "max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:z-50"
      : "max-lg:hidden"
  }

  lg:relative
`}
    >
      <div className="flex-1">
        <div className="  ">
          {/* {!sideOpen && (
            <div className={"flex pt-3 pe-3 justify-center "}>
              <button
                type="button"
                aria-label="Toggle sidebar"
                onClick={() => setSideOpen((prev) => !prev)}
                className="dark:text-gray-200 rounded-xl h-5 w-5 flex justify-center items-center text-gray-800 hover:bg-indigo-50 hover:dark:bg-indigo-950/60"
              >
                <Menu className="size-4" />
              </button>
            </div>
          )} */}
          <div
            className={`flex items-center ${sideOpen ? "gap-4" : "gap-2"}  mx-4 mt-4 mb-3 `}
          >
            <div className="shrink-0 rounded-full flex h-10 w-10 justify-center items-center bg-gradient-to-br from-violet-500 to-sky-500">
              <StickyNote className="size-4.5 font-bold text-white dark:text-gray-900" />
            </div>
            {showText && (
              <div
                className={`  overflow-hidden whitespace-nowrap transition-all duration-300   ${sideOpen ? "max-w-40 opacity-100" : "max-w-0 opacity-0"}`}
              >
                <h2 className="text-lg font-sans text-gray-900 dark:text-white font-bold">
                  NoteSphere
                </h2>
                <p className="text-xs text-gray-700 dark:text-gray-500">
                  Your ideas, organized
                </p>
              </div>
            )}
            {sideOpen && (
              <button
                type="button"
                aria-label="Toggle sidebar"
                onClick={() => setSideOpen((prev) => !prev)}
                className="lg:hidden dark:text-gray-200 rounded-xl h-5 w-5 flex justify-center items-center text-gray-800 hover:bg-indigo-50 hover:dark:bg-indigo-950/60"
              >
                <Menu className="size-4" />
              </button>
            )}
          </div>

          <div className="mx-4">
            <Link href={"/app/notes/new"}>
              <button
                aria-label="Create new note"
                className=" flex w-full items-center  gap-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                {showText && "New Note"}
              </button>
            </Link>
          </div>
        </div>

        <div className="mx-4 mt-3">
          {sidebarItems.map((item, idx) => (
            <Link
              aria-label={item.title}
              href={item.path}
              key={idx}
              className={`mt-0.5 text-sm cursor-pointer rounded-3xl px-4 py-2 duration-200 flex items-center gap-1.5 transition-colors hover:bg-indigo-50 hover:dark:bg-indigo-950/60 hover:text-gray-900 hover:dark:text-gray-200 ${isActive(item.path) ? "bg-indigo-50 dark:bg-indigo-950/60 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-400"}`}
            >
              <item.icon className="size-4" />
              {showText && <h4>{item.title}</h4>}
            </Link>
          ))}
        </div>
        <hr className="mt-2 dark:text-gray-800  text-gray-400"></hr>

        <div className="mx-4 mt-3">
          {sidebarBottomItems.map((item, idx) => (
            <Link
              aria-label={item.title}
              href={item.path}
              key={idx}
              className={`mt-0.5 text-sm cursor-pointer rounded-3xl px-4 py-2 duration-200 flex items-center gap-1.5 transition-colors hover:bg-indigo-50 hover:dark:bg-indigo-950/60 hover:text-gray-900 hover:dark:text-gray-200 ${path === item.path ? "bg-indigo-50 dark:bg-indigo-950/60 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-400"}`}
            >
              <item.icon className="size-4" />
              {showText && <h4>{item.title}</h4>}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[#FBFBFF] dark:bg-[#0C0E1C]">
        <hr className="text-gray-500"></hr>
        <div className="mx-2 my-4">
          <Button
            variant="outline"
            onClick={handlelogout}
            className={"py-5 w-full"}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidenavbar;
