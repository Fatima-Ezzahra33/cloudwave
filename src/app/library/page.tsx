import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import SuperLibraryClient from "@/components/SuperLibraryClient";
import LibraryClient from "@/components/SuperLibraryClient";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      playlists: {
        include: { 
          songs: { include: { artist: true } },
          _count: { select: { songs: true } } 
        },
      },
    },
  });

  if (!user) return null;

  return (
    <DashboardLayout>
      <GradientLayout
        color="#e8351e"
        title="Your Library"
        subtitle="Collection"
      >
        <LibraryClient playlists={user.playlists as any} />
      </GradientLayout>
    </DashboardLayout>
  );
}
