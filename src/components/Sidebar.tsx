import Link from "next/link";
import { Home, Search, Library, Heart, PlusSquare } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Library, label: "Your Library", href: "/library" },
];

const secondaryItems = [
  { icon: PlusSquare, label: "Create Playlist", href: "#" },
  { icon: Heart, label: "Liked Songs", href: "/favorites" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black flex flex-col border-r border-zinc-900 h-full">
      <div className="p-6">
        <Link href="/home" className="flex items-center gap-2">
           <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
             <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tighter">CLOUDWAVE</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-3 space-y-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-4 px-3 py-2 text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-zinc-900 font-medium"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-zinc-900">
          <ul className="space-y-1">
            {secondaryItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-4 px-3 py-2 text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-zinc-900 font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
