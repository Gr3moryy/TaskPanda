export default function Header({ logoColor = "text-primary-700" }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className={`text-2xl font-extrabold tracking-tight ${logoColor}`}>
          TaskPanda
        </a>
      </div>
    </header>
  );
}
