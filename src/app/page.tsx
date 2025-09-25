"use client";

import Drawer from "@/components/ui/Drawer";
import Header from "@/components/ui/Header";
import PostList from "@/components/PostList";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-gradient-to-tr from-purple-400 via-blue-400 to-indigo-400">
      <Drawer />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <div className="space-y-6">
            <PostList />
          </div>
        </main>
      </div>
    </div>
  );
}
