import { UserProvider } from "@/context/userContext";
import { getUser } from "@/lib/api/getUser";
import AppLayout from "@/components/appLayout";
import { redirect } from "next/navigation";

async function Layout({ children }) {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <UserProvider initialUser={user}>
      <AppLayout>{children}</AppLayout>
    </UserProvider>
  );
}

export default Layout;
