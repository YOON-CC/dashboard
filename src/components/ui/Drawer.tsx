"use client";

import { useState } from "react";

export default function Drawer() {
  const [open, setOpen] = useState(true);
  const companies = ["A", "B", "c"];

  return (
    <aside
      className={`transition-all duration-300 ${
        open ? "w-64" : "w-16"
      } backdrop-blur-xl bg-white/20 border-r border-white/30 flex flex-col`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="m-4 p-3 rounded-lg bg-white/25 text-white hover:bg-white/35 transition"
      >
        {open ? "Close" : "Open"}
      </button>
      {open && (
        <ul className="mt-6 space-y-2 px-2">
          {companies.map((c) => (
            <li
              key={c}
              className="p-3 rounded-lg hover:bg-white/30 cursor-pointer text-white transition"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
