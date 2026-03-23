"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import SongList from "@/components/SongList";
import { useQuery } from "@tanstack/react-query";
import { getUserMetadata } from "@/app/actions/music";

async function searchTracks(query: string) {
  if (!query) return [];
  const res = await fetch(`/api/search?q=${query}`);
  return res.json();
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchTracks(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const { data: userMetadata } = useQuery({
    queryKey: ["user-metadata"],
    queryFn: () => getUserMetadata(),
  });

  return (
    <DashboardLayout>
      <div className="h-full bg-[#111]/50 p-10 pt-24 noise">
        <div className="relative max-w-2xl mb-16">
           <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-[#e8351e] transition-colors" />
           <input 
              type="text" 
              placeholder="Search for tracks and artists..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white text-xl font-medium focus:outline-none focus:border-[#e8351e]/50 focus:bg-white/10 transition-all placeholder:text-white/10 shadow-2xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
           />
        </div>

        {debouncedQuery && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8 ml-6">Results for &quot;{debouncedQuery}&quot;</h2>
            {isLoading ? (
               <div className="text-white/20 font-bold uppercase tracking-widest text-xs ml-6">Searching...</div>
            ) : results.length > 0 ? (
               <SongList 
                  songs={results} 
                  likedSongIds={userMetadata?.data?.likedSongIds}
                  playlists={userMetadata?.data?.playlists}
               />
            ) : (
               <div className="text-white/20 font-bold uppercase tracking-widest text-xs ml-6">No tracks found matching your search.</div>
            )}
          </div>
        )}

        {!debouncedQuery && (
           <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#e8351e]/10 to-transparent"></div>
                 <SearchIcon className="w-8 h-8 text-white/20 group-hover:text-[#e8351e] group-hover:scale-110 transition-all" />
              </div>
              <h2 className="text-sm font-bold text-white/20 uppercase tracking-[0.3em]">Start your search</h2>
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}
