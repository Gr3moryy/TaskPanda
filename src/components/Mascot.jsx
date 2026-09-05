export default function Mascot() {
  return (
    <div className="relative flex aspect-square w-48 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-xl ring-1 ring-black/5 sm:w-56 sm:aspect-video sm:rounded-3xl">
      <img
        src="/assets/mascot.svg"
        alt="TaskPanda mascot"
        className="h-36 w-36 sm:h-40 sm:w-40"
      />
    </div>
  );
}
