export default function Loader() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-[#D4AF37] border-b-transparent rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
}
