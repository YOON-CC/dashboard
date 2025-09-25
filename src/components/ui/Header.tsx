"use client";

export default function Header() {
  return (
    <header className="backdrop-blur-lg bg-white/20 shadow-md py-4 px-6 flex justify-between items-center rounded-b-2xl mb-6">
      <h1 className="text-3xl font-extrabold text-white tracking-wide">
        Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <select className="rounded-lg bg-white/25 text-white p-2 px-3 backdrop-blur-md border border-white/30 hover:bg-white/30 transition">
          <option value="all">전체보기</option>
          <option value="US">나라1</option>
          <option value="DE">나라2</option>
        </select>
        <button className="rounded-lg bg-white/25 text-white p-2 px-3 backdrop-blur-md border border-white/30 hover:bg-white/30 transition">
          🌙
        </button>
      </div>
    </header>
  );
}
