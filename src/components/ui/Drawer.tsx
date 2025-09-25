"use client";

import { useState } from "react";

export default function Drawer() {
  const [open, setOpen] = useState(true);
  const companies = ["A", "B", "C"];

  return (
    <aside
      className={`transition-all duration-300 ${
        open ? "w-64" : "w-16"
      } backdrop-blur-lg bg-white/20 border-r border-white/30`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="m-2 p-2 rounded bg-white/20 text-white"
      >
        {open ? "Close" : "Open"}
      </button>
      {open && (
        <ul className="mt-4">
          {companies.map((c) => (
            <li
              key={c}
              className="p-2 hover:bg-white/10 rounded cursor-pointer text-white"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
