"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import SongList from "@/components/SongList";
import { useQuery } from "@tanstack/react-query";

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

  return (
    <DashboardLayout>
      <div className="h-full bg-zinc-900/10 p-8 pt-20">
        <div className="relative max-w-xl mb-12">
           <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
           <input 
              type="text" 
              placeholder="What do you want to listen to?" 
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-full py-4 pl-12 pr-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
           />
        </div>

        {debouncedQuery && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Results for &quot;{debouncedQuery}&quot;</h2>
            {isLoading ? (
               <div className="text-zinc-500">Searching...</div>
            ) : results.length > 0 ? (
               <SongList songs={results} />
            ) : (
               <div className="text-zinc-500">No tracks found matching your search.</div>
            )}
          </div>
        )}

        {!debouncedQuery && (
           <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <SearchIcon className="w-16 h-16 text-zinc-800 mb-4" />
              <h2 className="text-xl font-medium text-zinc-400">Search for tracks and artists</h2>
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}
