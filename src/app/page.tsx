"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavLink {
  label: string;
  href: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Trending", href: "#trend" },
];

const WHY_ITEMS = [
  "Vibe-matched music that feels personal",
  "Quick discovery with fresh recommendations",
  "A smooth, aesthetic listening experience",
];

const TRENDING_CARDS = [
  {
    title: "Neon Drift",
    artist: "JXNI",
    label: "Gone, But",
    img: "/artist-6.jpg", // replaced missing /trending-1.jpg
  },
  {
    title: "Look at me now",
    artist: "Ramengvrl",
    label: "Trending #1",
    img: "/artist-7.jpg", // replaced missing /trending-2.jpg
    featured: true,
  },
  {
    title: "Goodbye",
    artist: "Park",
    label: "",
    img: "/artist-8.jpg", // replaced missing /trending-3.jpg
  },
];

const TOP_ARTISTS = [
  { img: "/artist-1.jpg" }, // colorful group shot
  { img: "/artist-2.jpg" }, // dark rapper portrait
  { img: "/artist-3.jpg" }, // neon blue duo
  { img: "/artist-4.jpg" }, // girl group
  { img: "/artist-5.jpg" }, // blonde singer
  { img: "/artist-6.jpg" }, // band in earth tones
  { img: "/artist-7.jpg" }, // solo orange/red
  { img: "/artist-8.jpg" }, // close-up female artist
  { img: "/artist-9.jpg" }, // heart-hands pose
];

const FOOTER_COLS = [
  {
    heading: "Cloudwave",
    links: ["About", "Pricing", "Features", "Community"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
  },
  {
    heading: "For Artists",
    links: ["For Listeners", "For Artists", "For Labels"],
  },
  {
    heading: "Start Now !",
    links: [],
    app: true,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <span
    className={`inline-block bg-[#e8351e] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm ${className}`}
  >
    {children}
  </span>
);

const WaveBar: React.FC = () => (
  <div className="flex items-end gap-[2px] h-8">
    {[3, 6, 10, 7, 13, 9, 5, 11, 8, 14, 10, 6, 12, 7, 4, 9, 11, 6, 8, 13].map(
      (h, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-white opacity-80 animate-wave"
          style={{
            height: `${h * 2}px`,
            animationDelay: `${i * 60}ms`,
          }}
        />
      )
    )}
  </div>
);

const PlayerControls: React.FC = () => (
  <div className="flex items-center justify-between mt-3">
    <div className="flex items-center gap-4 text-white/60">
      {/* shuffle */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 4l4 4-4 4V9h-1.5c-.9 0-1.7.4-2.3 1L11 12.3c-.9 1-2.2 1.7-3.5 1.7H4v-2h3.5c.9 0 1.7-.4 2.3-1L12 8.7c.9-1 2.2-1.7 3.5-1.7H17V4zm0 12v-3h-1.5c-1.3 0-2.6-.7-3.5-1.7l-.8-.9-1.4 1.5.8.8c.6.7 1.4 1.2 2.3 1.5V17l4-1z" />
      </svg>
      {/* prev */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
      </svg>
    </div>
    {/* play/pause */}
    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#111">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    </button>
    <div className="flex items-center gap-4 text-white/60">
      {/* next */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
      </svg>
      {/* like */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const CloudwaveLanding: React.FC = () => {
  const [playing, setPlaying] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  // simple parallax tilt on hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      el.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="bg-[#111111] text-white min-h-screen font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1,h2,h3,.display { font-family: 'Syne', sans-serif; }
        @keyframes wave {
          0%,100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }
        .animate-wave { animation: wave 1.2s ease-in-out infinite; }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float { animation: float 3s ease-in-out infinite; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp .7s ease both; }
        .sticker {
          display:inline-block;
          background: white;
          color: #111;
          font-family:'Syne',sans-serif;
          font-weight:800;
          font-size:13px;
          padding:6px 14px;
          border-radius:4px;
          transform:rotate(-3deg);
          box-shadow:2px 4px 12px rgba(0,0,0,.4);
        }
        .sticker.red { background:#e8351e; color:#fff; transform:rotate(2deg); }
        .sticker.play {
          background:#111;
          color:#fff;
          border:1.5px solid #fff;
          transform:rotate(-1deg);
          display:flex; align-items:center; gap:6px;
        }
        .card-hover { transition: transform .25s ease, box-shadow .25s ease; }
        .card-hover:hover { transform:translateY(-6px); box-shadow:0 20px 40px rgba(0,0,0,.5); }
        .noise::after {
          content:''; position:absolute; inset:0; pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity:.04; mix-blend-mode:overlay;
        }
        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,.07) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .pill-avatar { border-radius: 9999px; overflow:hidden; border:2px solid #333; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-[#111]/80 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#e8351e] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wide text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              cloudwave
            </span>
          </div>
          <ul className="hidden md:flex gap-6">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-xs text-white/50 hover:text-white transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/signin" className="text-[10px] font-bold uppercase tracking-wider border border-white/20 text-white/80 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all">
          Login
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden dot-grid noise pt-20">
        {/* background blobs */}
        <div className="absolute top-16 right-0 w-72 h-72 bg-[#e8351e]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-56 h-56 bg-white/3 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 md:px-10 w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="fade-up" style={{ animationDelay: "0ms" }}>
            <h1 className="display text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6">
              Hit play and let's
              <br />
              <span className="text-white/90">vibe together</span>
            </h1>
            <p className="text-sm text-white/50 max-w-xs mb-8">
              Explore new sounds, new artists, and that one song you'll play on
              repeat.
            </p>
            <button className="bg-[#e8351e] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#c8291a] transition-colors">
              Get started
            </button>

            {/* stats */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="pill-avatar w-8 h-8 bg-white/20"
                    style={{ zIndex: 3 - i }}
                  />
                ))}
              </div>
              <div>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "Syne" }}>150K+</div>
                <div className="text-[10px] text-white/40">Listeners enjoying keen vibes together</div>
              </div>
            </div>
          </div>

          {/* Right — hero image + stickers */}
          <div
            ref={heroRef}
            className="relative fade-up flex justify-center"
            style={{ animationDelay: "150ms" }}
          >
            {/* hero portrait placeholder */}
            <div className="relative w-72 h-[420px] rounded-3xl overflow-hidden bg-white/5 border border-white/10">
              {/* Replace src with your actual image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/artist.jpg"
                alt="Musician with guitar"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
            </div>

            {/* floating labels */}
            <span className="sticker absolute top-8 left-[-24px] float" style={{ animationDelay: "0s" }}>
              Have fun
            </span>
            <span className="sticker red absolute top-16 left-[60px] float" style={{ animationDelay: ".4s" }}>
              Enjoy
            </span>
            <span className="sticker absolute top-12 right-[-16px] float" style={{ animationDelay: ".8s" }}>
              Chill
            </span>
            <span className="sticker play absolute bottom-24 right-[-20px] float" style={{ animationDelay: ".2s" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#e8351e">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </span>

            {/* vibes count chips */}
            <div className="absolute bottom-6 left-0 text-[10px] text-white/30 font-medium">New Vibes</div>
            <div className="absolute bottom-6 right-0 text-[10px] text-white/30 font-medium">New Feels</div>
          </div>
        </div>
      </section>

      {/* ── ABOUT / WHY ── */}
      <section className="relative py-20 px-6 md:px-10 max-w-5xl mx-auto" id="features">
        <Badge className="mb-6">About cloudwave</Badge>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <h2 className="display text-3xl md:text-4xl font-bold leading-snug">
            Cloudwave is a music space for vibe-seekers,{" "}
            <span className="text-white/40">offering smart recommendations and smooth interactions.</span>
          </h2>

          <div>
            <h3 className="display text-xl font-bold mb-6 text-center">Why Cloudwave Hits Different</h3>
            <ul className="space-y-3">
              {WHY_ITEMS.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between border border-white/8 rounded-xl px-4 py-3 hover:border-white/20 transition-colors cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#e8351e]" />
                    </span>
                    <span className="text-sm text-white/70">{item}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── TRENDING PLAYER ── */}
      <section className="py-20 px-6 md:px-10 max-w-5xl mx-auto text-center" id="trend">
        <Badge className="mb-4">Trending</Badge>
        <h2 className="display text-3xl md:text-4xl font-bold mb-10">
          Discover popular tracks with
          <br />
          today's hottest music.
        </h2>

        {/* Cards */}
        <div className="flex items-end justify-center gap-4 mb-6">
          {TRENDING_CARDS.map((card, i) => (
            <div
              key={i}
              className={`card-hover relative overflow-hidden rounded-2xl bg-white/5 border border-white/8 ${
                card.featured
                  ? "w-48 h-64 border-[#e8351e]/50"
                  : "w-36 h-48 opacity-70"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.img}
                alt={card.artist}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              {card.featured && (
                <span className="absolute top-3 left-3 bg-[#e8351e] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                  Trend #1
                </span>
              )}
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <div className="text-xs text-white/50">{card.label}</div>
                <div className="text-sm font-bold">{card.artist}</div>
                <div className="text-[11px] text-white/60">{card.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Player bar */}
        <div className="max-w-xs mx-auto bg-[#1a1a1a] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-left">
              <div className="text-xs font-bold">Ramengvrl</div>
              <div className="text-[10px] text-white/40">Look at me now</div>
            </div>
            <WaveBar />
          </div>
          {/* progress */}
          <div className="h-0.5 bg-white/10 rounded-full mb-1 overflow-hidden">
            <div className="h-full w-2/5 bg-white rounded-full" />
          </div>
          <div className="flex justify-between text-[9px] text-white/30 mb-2">
            <span>0:00</span><span>3:27</span>
          </div>
          <PlayerControls />
        </div>
      </section>

      {/* ── TOP ARTISTS 2025 ── */}
      <section className="py-20 px-6 md:px-10 max-w-5xl mx-auto">
        <Badge className="mb-4">Top Free 2025</Badge>
        <h2 className="display text-3xl md:text-4xl font-bold mb-10">
          See the artists who dominated 2025, the
          <br />
          year's top voices and hits
        </h2>

        {/* organic blob grid */}
        <div className="relative h-[380px]">
          {TOP_ARTISTS.map((a, i) => {
            // hand-placed positions to mimic the scattered blob layout
            const positions = [
              { top: "0%", left: "0%", size: 90 },
              { top: "0%", left: "18%", size: 100 },
              { top: "0%", left: "38%", size: 110 },
              { top: "35%", left: "2%", size: 95 },
              { top: "38%", left: "22%", size: 105 },
              { top: "35%", left: "42%", size: 90 },
              { top: "35%", left: "60%", size: 100 },
              { top: "5%", left: "60%", size: 110 },
              { top: "10%", left: "78%", size: 120 },
            ];
            const pos = positions[i] || { top: "0%", left: `${i * 11}%`, size: 90 };
            return (
              <div
                key={i}
                className="absolute card-hover overflow-hidden"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.size,
                  height: pos.size,
                  borderRadius: "50% 40% 55% 45% / 45% 55% 40% 50%",
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.img}
                  alt={`Artist ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative overflow-hidden bg-[#e8351e] mx-4 md:mx-10 rounded-3xl py-24 px-6 md:px-16 text-center noise">
        {/* decorative circles */}
        <div className="absolute top-[-60px] left-[-60px] w-64 h-64 rounded-full bg-[#c0281a] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-40px] w-80 h-80 rounded-full bg-[#b02010] opacity-50 pointer-events-none" />

        <Badge className="bg-white/20 text-white mb-6">What are you waiting for</Badge>
        <h2 className="display text-3xl md:text-5xl font-extrabold mb-10 relative z-10">
          Jump into a wave of fresh tracks
          <br />
          and let the music take over
        </h2>

        {/* CTA portrait */}
        <div className="relative inline-block mb-8">
          {/* blob shape behind image */}
          <div className="absolute inset-[-16px] rounded-full bg-[#c0281a] opacity-60 blur-md" />
          <div className="relative w-48 h-64 mx-auto overflow-hidden rounded-[40%_60%_60%_40%/60%_40%_60%_40%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cta-portrait.jpg"
              alt="Music listener"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-6 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
          {/* brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-[#e8351e] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                </svg>
              </div>
              <span className="text-sm font-bold" style={{ fontFamily: "Syne" }}>cloudwave</span>
            </div>
          </div>

          {FOOTER_COLS.map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold text-white/80 mb-3 uppercase tracking-wider">{col.heading}</h4>
              {col.app ? (
                <div className="flex flex-col gap-2">
                  <Link href="/signup" className="flex items-center justify-center gap-2 border border-white/10 bg-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Sign up
                  </Link>
                  <Link href="/signin" className="flex items-center justify-center gap-2 border border-white/10 bg-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Sign in
                  </Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* socials */}
          <div>
            <h4 className="text-xs font-bold text-white/80 mb-3 uppercase tracking-wider">Follow us</h4>
            <div className="flex gap-3">
              {["facebook", "twitter", "x", "instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-white/60 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 text-center">
          <p className="text-[10px] text-white/25">
            We use our partners and cookies to personalize ads based on your interests. For measurement and analytics, by using our services you agree to our use of cookies as described in our{" "}
            <a href="#" className="underline">Cookie Policy</a>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CloudwaveLanding;