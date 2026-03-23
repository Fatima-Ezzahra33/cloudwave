import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#111] overflow-hidden relative dot-grid noise">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
      </main>
      <Player />
    </div>
  );
}
