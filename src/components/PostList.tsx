"use client";

import LiquidCard from "./ui/LiquidCard";

const posts = [
  {
    id: "p1",
    title: "제목1",
    dateTime: "2025-07",
    content: "내용1",
  },
  {
    id: "p2",
    title: "제목2",
    dateTime: "2025-08",
    content: "내용1",
  },
  {
    id: "p3",
    title: "제목3",
    dateTime: "2025-09",
    content: "내용1",
  },
];

export default function PostList() {
  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <LiquidCard key={post.id}>
          <h2 className="text-lg font-bold text-white">{post.title}</h2>
          <p className="text-sm text-white/80">{post.dateTime}</p>
          <p className="text-white mt-2">{post.content}</p>
        </LiquidCard>
      ))}
    </div>
  );
}
