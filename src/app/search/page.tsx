"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import SongList from "@/components/SongList";
import { useQuery } from "@tanstack/react-query";
import { getUserMetadata } from "@/app/actions/music";

async function searchTracks(query: string = "") {
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
    enabled: true, // Always enabled to show default songs
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

        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8 ml-6">
            {debouncedQuery ? `Results for "${debouncedQuery}"` : "Recommended for you"}
          </h2>
          {isLoading ? (
             <div className="text-white/20 font-bold uppercase tracking-widest text-xs ml-6">Searching...</div>
          ) : results.length > 0 ? (
             <SongList 
                songs={results} 
                likedSongIds={userMetadata?.data?.likedSongIds}
                playlists={userMetadata?.data?.playlists}
             />
          ) : (
             <div className="text-white/20 font-bold uppercase tracking-widest text-xs ml-6">
               {debouncedQuery ? "No tracks found matching your search." : "No tracks available."}
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
