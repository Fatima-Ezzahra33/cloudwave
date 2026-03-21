import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>
      <Player />
    </div>
  );
}
