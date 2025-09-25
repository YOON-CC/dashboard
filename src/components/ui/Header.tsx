"use client";

export default function Header() {
  return (
    <header className="backdrop-blur-lg bg-white/20 shadow-md p-4 flex justify-between items-center rounded-b-2xl mb-4">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <div className="flex items-center gap-4">
        <select className="rounded bg-white/20 text-white p-2 backdrop-blur-md">
          <option value="all">전체보기</option>
          <option value="US">나라1</option>
          <option value="DE">나라2</option>
        </select>
        <button className="rounded bg-white/20 text-white p-2 backdrop-blur-md">
          🌙
        </button>
      </div>
    </header>
  );
}
