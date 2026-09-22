import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import memory1 from "@/assets/memories-1.jpg";
import memory2 from "@/assets/memories-2.jpg";
import memory3 from "@/assets/memories-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Saanvi" },
      {
        name: "description",
        content:
          "A little corner of the internet, made just for Saanvi — memories, wishes, and a candle waiting at the end.",
      },
      { property: "og:title", content: "Happy Birthday, Saanvi" },
      {
        property: "og:description",
        content:
          "A little corner of the internet, made just for Saanvi — memories, wishes, and a candle waiting at the end.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const LOVES = [
  {
    n: "1",
    bg: "bg-blush/60",
    title: "Your laugh",
    text: "The one that starts quiet and then completely takes over the room. I have never once been able to resist it.",
  },
  {
    n: "2",
    bg: "bg-gold/50",
    title: "How you listen",
    text: "You make everyone feel like they are the only person in the world. I don't know how you do it, but you do.",
  },
  {
    n: "3",
    bg: "bg-rose/40",
    title: "Your courage",
    text: "You say the true thing even when it's hard. That's rarer than you'll ever let yourself believe.",
  },
];

const WISHES = [
  "May this year hand you every quiet joy you've been quietly hoping for, without you even having to ask.",
  "May you keep being exactly as brave and a little bit stubborn as you are today. Don't you dare soften.",
  "And may you always know — you are so, so loved. More than this little page could ever hold.",
];

function Index() {
  const [wished, setWished] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);

  const makeWish = useCallback(() => {
    setWished(true);
    const burst = Array.from({ length: 14 }, (_, i) => i);
    setHearts((prev) => [...prev, ...burst]);
    window.setTimeout(() => setHearts([]), 2600);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-body text-foreground">
      {/* ambient gradient light */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 size-[420px] rounded-full bg-blush/50 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[460px] rounded-full bg-gold/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 size-[380px] rounded-full bg-rose/30 blur-3xl" />
      </div>

      {/* floating balloons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="balloon left-[12%] top-[70%] size-10 bg-rose/40" />
        <div className="balloon left-[28%] top-[80%] size-7 bg-gold/50" style={{ animationDelay: "1.5s" }} />
        <div className="balloon left-[68%] top-[75%] size-12 bg-blush/60" style={{ animationDelay: "0.8s" }} />
        <div className="balloon left-[82%] top-[85%] size-8 bg-rose/40" style={{ animationDelay: "2.4s" }} />
        <div className="balloon left-[48%] top-[90%] size-6 bg-gold/50" style={{ animationDelay: "3.2s" }} />
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <div className="rounded-[min(4vw,32px)] bg-white/40 p-8 ring-1 ring-black/5 backdrop-blur-xl sm:p-14">
            <p className="fade-up text-sm font-medium uppercase tracking-[0.25em] text-rose-deep" style={{ animationDelay: "0.1s" }}>
              A little celebration, just for you
            </p>
            <h1
              className="fade-up mt-6 font-display text-6xl font-semibold leading-none text-foreground sm:text-7xl"
              style={{ animationDelay: "0.25s", maxWidth: "20ch" }}
            >
              Happy Birthday, <span className="italic text-rose-deep">Saanvi</span>
            </h1>
            <p className="fade-up mt-8 max-w-[46ch] text-base text-foreground/70 sm:text-lg" style={{ animationDelay: "0.4s" }}>
              I made this little corner of the internet just to say the things I keep meaning to say. Scroll slowly —
              there's a candle waiting for you at the end.
            </p>
            <div className="fade-up mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.55s" }}>
              <a
                href="#wishes"
                className="rounded-full bg-rose-deep px-7 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-rose-deep transition-transform hover:-translate-y-0.5"
              >
                Make a wish with me
              </a>
              <a
                href="#memories"
                className="rounded-full px-6 py-3 text-sm font-medium text-foreground/70 transition-transform hover:-translate-y-0.5"
              >
                Read the memories
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MEMORIES */}
      <section id="memories" className="relative scroll-mt-8">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="mb-12 max-w-[40ch]">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-deep">The things I love</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              A few of my favorite yous
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {LOVES.map((love, i) => (
              <div
                key={love.n}
                className="group rounded-[min(3vw,24px)] bg-white/40 p-7 ring-1 ring-black/5 backdrop-blur-xl transition-transform hover:-translate-y-1.5"
              >
                <div
                  className={`drift mb-5 inline-grid size-12 place-items-center rounded-full ${love.bg}`}
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <span className="font-display text-lg text-rose-deep">{love.n}</span>
                </div>
                <h3 className="font-display text-xl font-medium text-foreground">{love.title}</h3>
                <p className="mt-3 text-sm text-foreground/70">{love.text}</p>
              </div>
            ))}
          </div>

          {/* memory photo strip */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <figure className="overflow-hidden rounded-[min(3vw,24px)] ring-1 ring-black/5">
              <img
                src={memory1}
                alt="Two friends laughing together in golden afternoon light"
                width={1024}
                height={1280}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </figure>
            <figure className="overflow-hidden rounded-[min(3vw,24px)] ring-1 ring-black/5">
              <img
                src={memory2}
                alt="A candlelit birthday table with a small cake and string lights"
                width={1024}
                height={1280}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </figure>
            <figure className="overflow-hidden rounded-[min(3vw,24px)] ring-1 ring-black/5">
              <img
                src={memory3}
                alt="A handwritten birthday card beside a single rose"
                width={1024}
                height={1280}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* WISHES */}
      <section id="wishes" className="relative scroll-mt-8">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <div className="rounded-[min(4vw,32px)] bg-white/40 p-8 ring-1 ring-black/5 backdrop-blur-xl sm:p-14">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-deep">My wishes for you</p>
            <div className="mt-8 space-y-8">
              {WISHES.map((wish, i) => (
                <div key={i} className="flex gap-5">
                  <span className="font-display text-3xl italic text-rose/70">0{i + 1}</span>
                  <p className="max-w-[44ch] text-base text-foreground/80 sm:text-lg">{wish}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING / WISH MOMENT */}
      <section className="relative">
        <div className="mx-auto max-w-3xl px-6 py-20 pb-28 sm:py-28">
          <div className="relative rounded-[min(4vw,32px)] bg-white/50 p-8 text-center ring-1 ring-black/5 backdrop-blur-xl sm:p-14">
            <div
              className={`mx-auto mb-8 inline-grid size-16 place-items-center rounded-full transition-all duration-700 ${
                wished ? "bg-gold/25" : "bg-gold/50 flicker"
              }`}
            >
              <span className={`font-display text-3xl ${wished ? "text-foreground/40" : "text-rose-deep"}`}>
                {wished ? "✦" : "🕯"}
              </span>
            </div>
            <h2 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {wished ? "Wish made" : "Now it's your turn"}
            </h2>
            <p className="mx-auto mt-5 max-w-[40ch] text-base text-foreground/70 sm:text-lg">
              {wished
                ? "It's on its way. I'll be right here when you open your eyes."
                : "Close your eyes, hold a wish, and tap the button. I'll be right here when you open them."}
            </p>
            {!wished && (
              <button
                type="button"
                onClick={makeWish}
                className="mt-10 rounded-full bg-rose-deep px-9 py-4 text-base font-semibold text-primary-foreground ring-1 ring-rose-deep transition-transform hover:-translate-y-0.5"
              >
                Make a wish
              </button>
            )}

            {/* floating hearts on wish */}
            <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden rounded-[inherit]">
              {hearts.map((h) => (
                <span
                  key={`${h}-${hearts.length}`}
                  className="heart text-xl"
                  style={{
                    left: `${42 + (h % 5) * 4}%`,
                    animationDelay: `${(h % 7) * 0.15}s`,
                  }}
                >
                  {h % 3 === 0 ? "❤" : h % 3 === 1 ? "✦" : "✿"}
                </span>
              ))}
            </div>

            <p className="mt-10 font-display text-lg italic text-rose-deep">With all my heart, your friend</p>
          </div>
        </div>
      </section>
    </div>
  );
}
