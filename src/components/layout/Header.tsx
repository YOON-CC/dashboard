"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isDetailPage?: string;
}

const Header = ({
  isDrawerOpen,
  setIsDrawerOpen,
  isDetailPage,
}: HeaderProps) => {
  return (
    <header className="backdrop-blur-[12px] bg-black/10 border border-white/20 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
      {/* 왼쪽: 메뉴 버튼 + 타이틀 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:scale-105"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-white">
            {isDetailPage ? isDetailPage : "탄소 배출량 대시보드"}
          </h2>{" "}
          <p className="text-white/60">
            {isDetailPage ? "상세페이지" : "실시간 환경 영향 모니터링 시스템"}
          </p>
        </div>
      </div>

      {/* 오른쪽: 유저 아바타 */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">A</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
