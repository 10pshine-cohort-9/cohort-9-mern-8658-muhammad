"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Laptop, Monitor, Moon, Sun, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { DeleteAccount } from "./action";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function page() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [notifications, setNotifications] = useState({
    product: true,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  let handleDeleteAccount = async () => {
    let res = await DeleteAccount();
    if (!res.success) {
      toast.add({ type: "error", description: "Failed to delete account" });
      return;
    }
    toast.add({ type: "success", description: "Account Deleted" });
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] px-3 sm:px-6 py-6 ">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Setting</h1>
      <p className="mt-2 text-muted-foreground">
        Customize NoteSphere to your taste
      </p>

      <Card className="rounded-3xl bg-white dark:bg-[#0D0F1D] shadow mt-4">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-sky-500">
              <Monitor className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="font-bold text-lg">Appearance</h2>

              <p className="text-sm text-muted-foreground">
                Choose how NoteSphere looks
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setTheme("light")}
              aria-label="light"
              className={`rounded-2xl border px-6 py-4 transition ${
                theme === "light"
                  ? "border-violet-500 bg-violet-50"
                  : "hover:bg-muted"
              }`}
            >
              <Sun className="mx-auto h-6 w-6 mb-3" />
              <p className="font-medium">Light</p>
            </button>

            <button
              type="button"
              aria-label="dark"
              onClick={() => setTheme("dark")}
              className={`rounded-2xl border px-6 py-4 transition ${
                theme === "dark"
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950"
                  : "hover:bg-muted"
              }`}
            >
              <Moon className="mx-auto h-6 w-6 mb-3" />
              <p className="font-medium">Dark</p>
            </button>

            <button
              type="button"
              aria-label="system"
              onClick={() => setTheme("system")}
              className={`rounded-2xl border  px-4   py-4 transition ${
                theme === "system"
                  ? "border-violet-500 dark:bg-violet-950 bg-violet-50"
                  : "hover:bg-muted"
              }`}
            >
              <Laptop className="mx-auto h-6 w-6 mb-3" />
              <p className="font-medium">System</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl bg-white dark:bg-[#0D0F1D] shadow mt-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-sky-500">
              <Bell className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="font-bold text-lg">Notifications</h2>

              <p className="text-sm text-muted-foreground">
                Control what you get pinged about
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border px-4 py-4">
              <p>Product updates</p>

              <Switch
                checked={notifications.product}
                onCheckedChange={(value) =>
                  setNotifications({
                    ...notifications,
                    product: value,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border px-4 py-4">
              <p>Marketing emails</p>

              <Switch
                checked={notifications.marketing}
                onCheckedChange={(value) =>
                  setNotifications({
                    ...notifications,
                    marketing: value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl bg-white dark:bg-[#0D0F1D] shadow mt-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-sky-500">
              <Trash2 className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="font-bold text-lg">Danger zone</h2>

              <p className="text-sm text-muted-foreground">
                Irreversible actions
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                >
                  Delete Account
                </Button>
              }
            />
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <Trash2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete Account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  variant="destructive"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
