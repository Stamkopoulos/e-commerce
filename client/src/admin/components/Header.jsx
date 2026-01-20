import { UserButton } from "@clerk/clerk-react";

export default function Topbar() {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h2 className="font-semibold text-lg">Dashboard</h2>

      {/* Clerk user menu + logout */}
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
