"use client";

import { cn } from "@/lib/utils";

interface GradientLayoutProps {
  children: React.ReactNode;
  color?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  roundImage?: boolean;
}

export default function GradientLayout({
  children,
  color = "#121212",
  title,
  subtitle,
  description,
  image,
  roundImage = false,
}: GradientLayoutProps) {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{
        backgroundImage: `linear-gradient(${color} 0%, rgba(0,0,0,1) 100%)`,
      }}
    >
      <div className="flex flex-col h-full bg-black/40">
        <div className="p-8 pb-4 flex items-end gap-6 h-64 md:h-80">
          {image && (
            <div className={cn("w-48 h-48 md:w-64 md:h-64 shadow-2xl overflow-hidden", roundImage ? "rounded-full" : "rounded-md")}>
               <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                 {/* Placeholder for real image */}
                 <div className="w-24 h-24 bg-zinc-700 rounded-md" />
               </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{subtitle}</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white display leading-none">
              {title}
            </h1>
            {description && <p className="text-sm text-white/40 mt-3 font-medium max-w-xl">{description}</p>}
          </div>
        </div>
        
        <div className="flex-1 p-8 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
