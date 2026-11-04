import { cookies } from "next/headers";
import Sidebar from "@/components/admin/Sidebar";
import { SIDEBAR_COOKIE } from "@/lib/admin-constants";
import { logoutAction } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const initialCollapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "1";
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <Sidebar logout={logoutAction} initialCollapsed={initialCollapsed} />
      <main className="min-w-0 flex-1">
        <div className="w-full px-4 py-6 md:px-8 md:py-8 2xl:px-10">{children}</div>
      </main>
    </div>
  );
}
