import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { ListMusic } from "lucide-react";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      playlists: {
        include: { _count: { select: { songs: true } } },
      },
    },
  });

  if (!user) return null;

  return (
    <DashboardLayout>
      <GradientLayout
        color="#242424"
        title="Your Library"
        subtitle="Collection"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {user?.playlists.map((playlist) => (
            <Link 
               key={playlist.id}
               href={`/playlist/${playlist.id}`}
               className="bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800/80 transition-all cursor-pointer group shadow-lg flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square bg-zinc-800 rounded-md mb-4 flex items-center justify-center shadow-xl">
                 <ListMusic className="w-12 h-12 text-zinc-600 group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-bold text-white truncate w-full">{playlist.name}</h3>
              <p className="text-zinc-400 text-sm">{playlist._count.songs} songs</p>
            </Link>
          ))}
        </div>
      </GradientLayout>
    </DashboardLayout>
  );
}
