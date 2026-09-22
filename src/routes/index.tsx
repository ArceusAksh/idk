import { useCallback, useRef, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw, Volume1, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import imageOne from "@/assets/1.png";
import imageTwo from "@/assets/2.png";
import imageThree from "@/assets/3.png";
import imageFour from "@/assets/4.png";
import soundtrack from "@/assets/Nashe Si Chadh Gayi Befikre 320 Kbps.mp3";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy 15th Birthday, Saanvi" },
      {
        name: "description",
        content:
          "A birthday letter, six wishes, four memories, and a little bit of billu magic made especially for Saanvi.",
      },
      { property: "og:title", content: "Happy 15th Birthday, Saanvi" },
      {
        property: "og:description",
        content: "A tiny birthday world made with love for Saanvi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WISHES = [
  "May your 15th be the best year in your life till now",
  "Mastikhor jiwan mile aapko 😝🥰🤪🥰",
  "Love that is consistent, warm, and completely certain of you.. (ye sentence kahi se le aya wrna kaash mai hi hou.. 😄😄)",
  "Aapki zindagi me sukh shaanti hoye 😇😇😇",
  "Saare billu aapse attract hoyeeee 🐱🐱 .",
  "A year so good it makes every year before feel like the warm-up",
];

const MEMORIES = [
  {
    image: imageOne,
    alt: "Saanvi smiling during a late-night video call",
    caption: "Late night calls with my favourite person 🌙",
    className: "memory-tilt-left",
  },
  {
    image: imageTwo,
    alt: "Saanvi performing classical dance on stage",
    caption: "Stage queen / classical grace 🪷✨",
    className: "memory-tilt-right memory-tall",
  },
  {
    image: imageThree,
    alt: "Saanvi performing a classical dance pose",
    caption: "Unmatched vibes on stage 💃",
    className: "memory-tilt-left memory-tall",
  },
  {
    image: imageFour,
    alt: "Saanvi laughing during a video call",
    caption: "The smile that makes everything better 🥺",
    className: "memory-tilt-right",
  },
];

const BURST_EMOJI = ["🐾", "♡", "✦", "🐱", "💕", "✨"];

const CONFETTI_EMOJI = ["🎊", "🎉", "🎈", "🥳", "✨", "🎉", "♡", "✦"];

type CatBurst = {
  id: number;
  emoji: string;
  left: number;
  size: number;
  tx: number;
  ty: number;
  rot: number;
  dur: number;
  delay: number;
};

function Index() {
  const [opened, setOpened] = useState(false);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [wished, setWished] = useState(false);
  const [catBursts, setCatBursts] = useState<CatBurst[]>([]);
  const [confetti, setConfetti] = useState<CatBurst[]>([]);
  const [lastPet, setLastPet] = useState(0);
  const burstId = useRef(0);
  const burstTimer = useRef<number | undefined>(undefined);
  const confettiTimer = useRef<number | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const setVol = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, value));
    audio.volume = clamped;
    if (clamped > 0) audio.muted = false;
    setVolume(clamped);
    setMuted(audio.muted);
  };

  const replaySong = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    if (audio.paused) void audio.play();
    setPlaying(true);
  };

  const seekSong = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const spawnBursts = useCallback((count: number) => {
    return Array.from({ length: count }, () => {
      burstId.current += 1;
      const i = burstId.current;
      return {
        id: i,
        emoji: BURST_EMOJI[i % BURST_EMOJI.length] ?? "♡",
        left: 8 + ((i * 29) % 84),
        size: 1.0 + ((i % 10) / 10) * 0.9,
        tx: -64 + ((i * 23) % 128),
        ty: -80 - ((i * 19) % 90),
        rot: -35 + ((i * 31) % 70),
        dur: 1.2 + ((i % 9) / 10),
        delay: (i % 6) * 0.07,
      };
    });
  }, []);

  const spawnConfetti = useCallback((count: number) => {
    return Array.from({ length: count }, () => {
      burstId.current += 1;
      const i = burstId.current;
      return {
        id: i,
        emoji: CONFETTI_EMOJI[i % CONFETTI_EMOJI.length] ?? "🎉",
        left: 3 + ((i * 17) % 94),
        size: 1.1 + ((i % 9) / 10) * 0.9,
        tx: -70 + ((i * 21) % 140),
        ty: 105,
        rot: ((i * 47) % 360) - 180,
        dur: 2.8 + ((i % 8) / 10),
        delay: (i % 10) * 0.16,
      };
    });
  }, []);

  const openLetter = useCallback(() => {
    setOpened(true);
    setConfetti((previous) => [...previous, ...spawnConfetti(28)]);
    window.clearTimeout(confettiTimer.current);
    confettiTimer.current = window.setTimeout(() => setConfetti([]), 4500);
  }, [spawnConfetti]);

  const petBillu = useCallback(() => {
    setLastPet(Date.now());
    setCatBursts((previous) => [...previous, ...spawnBursts(12)]);
    window.clearTimeout(burstTimer.current);
    burstTimer.current = window.setTimeout(() => setCatBursts([]), 2800);
  }, [spawnBursts]);

  const makeWish = useCallback(() => {
    setWished(true);
    setLastPet(Date.now());
    setCatBursts((previous) => [...previous, ...spawnBursts(18)]);
    window.clearTimeout(burstTimer.current);
    burstTimer.current = window.setTimeout(() => setCatBursts([]), 3000);
  }, [spawnBursts]);

  const toggleWish = (index: number) => {
    setFlipped((previous) =>
      previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index],
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background font-body text-foreground">
      <div className="page-light page-light-one" aria-hidden="true" />
      <div className="page-light page-light-two" aria-hidden="true" />

      <div className="cat-trail" aria-hidden="true">
        <span>🐾</span><span>🐾</span><span>🐾</span><span>🐾</span>
      </div>

      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
        {catBursts.map((burst) => (
          <span
            key={burst.id}
            className="cat-burst"
            style={
              {
                "--bx": `${burst.left}%`,
                "--bsize": `${burst.size}rem`,
                "--tx": `${burst.tx}px`,
                "--ty": `${burst.ty}px`,
                "--rot": `${burst.rot}deg`,
                "--dur": `${burst.dur}s`,
                "--delay": `${burst.delay}s`,
              } as CSSProperties
            }
          >
            {burst.emoji}
          </span>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
        {confetti.map((bit) => (
          <span
            key={bit.id}
            className="confetti-bit"
            style={
              {
                "--bx": `${bit.left}%`,
                "--bsize": `${bit.size}rem`,
                "--tx": `${bit.tx}px`,
                "--rot": `${bit.rot}deg`,
                "--dur": `${bit.dur}s`,
                "--delay": `${bit.delay}s`,
              } as CSSProperties
            }
          >
            {bit.emoji}
          </span>
        ))}
      </div>

      {!opened && (
        <div className="envelope-screen fixed inset-0 z-40 grid place-items-center px-6">
          <div className="envelope-glow" aria-hidden="true" />
          <div className="relative w-full max-w-[430px] text-center">
            <p className="eyebrow fade-up">A little something for</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-none text-foreground sm:text-7xl">
              Saanvi
            </h1>
            <div className="envelope-wrap mt-12">
              <div className="envelope-paper">
                <span className="font-display text-2xl italic text-rose-deep">For Saanvi</span>
                <span className="mt-2 text-xs uppercase tracking-[0.22em] text-foreground/50">open when ready</span>
              </div>
              <div className="envelope-flap" />
              <Button
                type="button"
                onClick={openLetter}
                className="wax-seal"
                aria-label="Open Saanvi's birthday letter"
              >
                S
              </Button>
            </div>
            <p className="mt-10 text-sm text-foreground/60">tap the seal to open your birthday letter</p>
            <button type="button" onClick={petBillu} className="cat-peek cat-peek-envelope" aria-label="Pet the envelope cat">
              <span key={lastPet} className="cat-bop">🐈</span>
              {lastPet > 0 && <span key={`poof-${lastPet}`} className="cat-poof" aria-hidden="true" />}
            </button>
          </div>
        </div>
      )}

      {opened && (
        <>
          <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
            <span className="font-display text-xl italic text-rose-deep">for saanvi, always</span>
            <a href="#memories" className="nav-link">keep scrolling ↓</a>
          </nav>

          <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-10 sm:pt-20">
            <div className="hero-grid">
              <div className="hero-copy">
                <p className="eyebrow fade-up">Celebrating Saanvi's 15th Birthday · 2026 ✨</p>
                <h1 className="fade-up mt-6 max-w-[11ch] font-display text-6xl font-semibold leading-[0.92] text-foreground sm:text-8xl" style={{ animationDelay: "0.15s" }}>
                  Happy 15th Birthday, <span className="italic text-rose-deep">Saanvi</span>
                </h1>
                <p className="fade-up mt-8 max-w-[48ch] text-base leading-7 text-foreground/70 sm:text-lg" style={{ animationDelay: "0.3s" }}>
                  Aaj ka din celebrate krne wala hi h bcoj agar tum nhi hoti to idk what my life would be mai kaise logo ke sath hota idk par tum khud hi celebrate nhi krti to I just created a card for you, sorry mai zyada kuchh ni kar paya like a handmade card bcz of parents
                </p>
                <div className="fade-up mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.45s" }}>
                  <a href="#wishes" className="primary-link">six little wishes <span>↓</span></a>
                  <a href="#memories" className="quiet-link">see your photos</a>
                </div>
              </div>

              <div className="hero-portrait-wrap fade-up" style={{ animationDelay: "0.25s" }}>
                <div className="hero-portrait-frame">
                  <img src={imageTwo} alt="Saanvi in her beautiful classical dance costume" className="hero-portrait" />
                  <span className="hero-sticker hero-sticker-one">15</span>
                  <span className="hero-sticker hero-sticker-two">♡</span>
                </div>
                <p className="mt-4 text-center font-display text-lg italic text-rose-deep">the birthday girl herself ✦</p>
                <button type="button" onClick={petBillu} className="cat-peek cat-peek-hero" aria-label="Pet the birthday cat">
                  <span key={lastPet} className="cat-bop">😺</span>
                  {lastPet > 0 && <span key={`poof-${lastPet}`} className="cat-poof" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className={`music-pill mt-16 ${playing ? "is-playing" : ""}`}>
              <div className="music-disc"><span>♫</span></div>
              <div className="music-player-body">
                <div className="music-player-top">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-rose-deep">our birthday soundtrack</p>
                    <p className="mt-1 truncate font-display text-lg text-foreground">Nashe Si Chadh Gayi</p>
                    <p className="text-xs text-foreground/55">Befikre · Arijit Singh</p>
                  </div>
                  <div className="music-player-actions">
                    <div className="music-vol">
                      <button type="button" onClick={toggleMute} className="music-btn" aria-label={muted ? "Unmute" : "Mute"}>
                        {muted || volume === 0 ? (
                          <VolumeX size={18} />
                        ) : volume < 0.5 ? (
                          <Volume1 size={18} />
                        ) : (
                          <Volume2 size={18} />
                        )}
                      </button>
                      <div className="music-vol-panel">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={volume}
                          onChange={(event) => setVol(Number(event.target.value))}
                          className="music-progress"
                          style={{ "--fill": `${volume * 100}%` } as CSSProperties}
                          aria-label="Volume"
                        />
                      </div>
                    </div>
                    <button type="button" onClick={replaySong} className="music-btn" aria-label="Replay from the start">
                      <RotateCcw size={18} />
                    </button>
                    <button type="button" onClick={togglePlay} className="music-btn-play" aria-label={playing ? "Pause" : "Play"}>
                      {playing ? <Pause size={20} strokeWidth={2.4} /> : <Play size={20} strokeWidth={2.4} className="translate-x-[1px]" />}
                    </button>
                  </div>
                </div>
                <div className="music-player-bar">
                  <span className="music-times">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={(event) => seekSong(Number(event.target.value))}
                    className="music-progress"
                    style={{ "--fill": `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties}
                    aria-label="Seek through the song"
                  />
                  <span className="music-times">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={soundtrack}
              preload="metadata"
              className="hidden"
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onVolumeChange={(event) => {
                setVolume(event.currentTarget.volume);
                setMuted(event.currentTarget.muted);
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />
          </section>

          <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
            <div className="section-heading">
              <p className="eyebrow">just so you know</p>
              <h2 className="mt-4 max-w-[11ch] font-display text-5xl font-semibold leading-none sm:text-7xl">things I want you to hear</h2>
            </div>
            <div className="confession-grid mt-12">
              <article className="confession-card confession-card-pink">
                <span className="confession-mark">01</span>
                <p className="mt-14 font-display text-3xl leading-tight text-foreground sm:text-4xl">I'm so happy ki you are my friend (🥺 🥺 yahi kehna pad rha h)</p>
                <span className="mt-8 block text-2xl text-rose-deep">♡</span>
              </article>
              <article className="confession-card confession-card-gold">
                <span className="confession-mark">02</span>
                <p className="mt-14 font-display text-3xl leading-tight text-foreground sm:text-4xl">On your birthday, I just want to say ki I love you so fking muchhhhh and idk how to express it through text or even IRL to just maine yahi pe likh diya cuz i have freedom here koi kya keh lega 😼</p>
                <span className="mt-8 block text-2xl text-rose-deep">✦</span>
              </article>
            </div>
          </section>

          <section id="wishes" className="relative z-10 scroll-mt-8 px-6 py-20 sm:px-10 sm:py-28">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">six wishes for you</p>
                  <h2 className="mt-4 max-w-[12ch] font-display text-5xl font-semibold leading-none sm:text-7xl">pick a card, any card</h2>
                </div>
                <p className="max-w-[25ch] text-sm leading-6 text-foreground/60">Tap each little card. There is a wish hiding on the other side.</p>
              </div>
              <div className="wish-grid mt-12">
                {WISHES.map((wish, index) => {
                  const isFlipped = flipped.includes(index);
                  return (
                    <button
                      type="button"
                      key={wish}
                      onClick={() => toggleWish(index)}
                      className={`wish-card ${isFlipped ? "is-flipped" : ""}`}
                      aria-label={`${isFlipped ? "Hide" : "Reveal"} wish ${index + 1}`}
                    >
                      <span className="wish-card-inner">
                        <span className="wish-face wish-front">
                          <span className="wish-number">0{index + 1}</span>
                          <span className="wish-cat">{index === 4 ? "🐈" : index % 2 === 0 ? "✦" : "♡"}</span>
                          <span className="wish-tap">tap to reveal</span>
                        </span>
                        <span className="wish-face wish-back">
                          <span className="wish-number">0{index + 1}</span>
                          <span className="wish-text">{wish}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="memories" className="relative z-10 scroll-mt-8 px-6 py-20 sm:px-10 sm:py-28">
            <div className="mx-auto max-w-6xl">
              <div className="section-heading">
                <p className="eyebrow">a tiny gallery of you</p>
                <h2 className="mt-4 max-w-[10ch] font-display text-5xl font-semibold leading-none sm:text-7xl">the moments I keep</h2>
              </div>
              <div className="memory-grid mt-14">
                {MEMORIES.map((memory) => (
                  <figure key={memory.caption} className={`polaroid ${memory.className}`}>
                    <div className="polaroid-image-wrap">
                      <img src={memory.image} alt={memory.alt} loading="lazy" className="polaroid-image" />
                    </div>
                    <figcaption>{memory.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className="relative z-10 px-6 py-20 sm:px-10 sm:py-28">
            <div className="closing-note mx-auto max-w-4xl">
              <p className="eyebrow">one last thing</p>
              <p className="mt-7 max-w-[27ch] font-display text-4xl leading-tight text-foreground sm:text-6xl">Bas dekho tum ye kabhi mat sochna ki there is no one for you...</p>
              <p className="mt-8 max-w-[60ch] text-base leading-7 text-foreground/75 sm:text-lg">no matter what I'll be here, NO MATTER WHAT.. I spend so much time on calls with you to you should understand ki even though tumhari family, friends, koi bhi care/support kre na kre I will do it.. Happy Birthday!</p>
              <p className="mt-8 font-display text-xl italic text-rose-deep">always, your favourite person to call</p>
            </div>
          </section>

          <section className="relative z-10 px-6 pb-32 pt-20 sm:px-10">
            <div className="wish-ending mx-auto max-w-3xl text-center">
              <div className={`candle ${wished ? "candle-out" : ""}`} aria-hidden="true"><span className="flame">✦</span><span className="candle-stick" /></div>
              <p className="eyebrow">the final little moment</p>
              <h2 className="mt-5 font-display text-5xl font-semibold leading-none sm:text-7xl">{wished ? "Wish made ✨" : "make a wish, birthday girl"}</h2>
              <p className="mx-auto mt-6 max-w-[40ch] text-base leading-7 text-foreground/65">{wished ? "Okay, it's officially on its way. And yes, the billus are coming too." : "Close your eyes, think of something beautiful, and tap the candle."}</p>
              {!wished && <Button type="button" onClick={makeWish} className="mt-9 rounded-full px-8 py-6 text-base">make a wish ✦</Button>}
            </div>
          </section>
        </>
      )}
    </main>
  );
}