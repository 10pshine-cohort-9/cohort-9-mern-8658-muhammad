import { SignupForm } from "@/components/signup-form";
import { getUser } from "@/lib/api/getUser";
import { File } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();

  if (user) {
    redirect("/app");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 dark:bg-[#070811]">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <File className="size-4" />
          </div>
          NoteSphere
        </Link>
        <SignupForm className={"dark:bg-[#101321]"} />
      </div>
    </div>
  );
}
