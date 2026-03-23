"use client";

import Link from "next/link";
import { Home, Search, Library, Heart, PlusSquare, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Library, label: "Your Library", href: "/library" },
];

const secondaryItems = [
  { icon: Heart, label: "Liked Songs", href: "/favorites" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#111] flex flex-col border-r border-white/5 h-full relative z-20 shadow-2xl">
      <div className="p-8">
        <Link href="/home" className="flex items-center gap-3 group text-white decoration-none hover:no-underline font-heading">
           <div className="w-7 h-7 bg-[#e8351e] rounded-full flex items-center justify-center shadow-lg shadow-[#e8351e]/20 group-hover:scale-110 transition-transform">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
               <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
             </svg>
          </div>
          <span className="text-base font-bold tracking-widest text-white display">CLOUDWAVE</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-4 px-4 py-2.5 text-white/40 hover:text-white transition-all rounded-xl hover:bg-white/5 font-bold text-xs uppercase tracking-widest group"
              >
                <item.icon className="w-5 h-5 group-hover:text-[#e8351e] transition-colors" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="pt-6 border-t border-white/5">
          <ul className="space-y-1">
            {secondaryItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-2.5 text-white/40 hover:text-white transition-all rounded-xl hover:bg-white/5 font-bold text-xs uppercase tracking-widest group"
                >
                  <item.icon className="w-5 h-5 group-hover:text-[#e8351e] transition-colors" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto pb-28">
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="w-full flex items-center gap-4 px-4 py-3 text-white/40 hover:text-[#e8351e] transition-all rounded-xl hover:bg-[#e8351e]/5 font-bold text-xs uppercase tracking-widest group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
}
