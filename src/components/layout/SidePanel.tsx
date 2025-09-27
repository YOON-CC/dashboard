"use client";

import { Company } from "@/lib/types";
import { Leaf, X, Menu, Globe, Building2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface SidePanelProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  showDetailDropdown: boolean;
  setShowDetailDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  companies: Company[];
}

const SidePanel = ({
  isDrawerOpen,
  setIsDrawerOpen,
  showDetailDropdown,
  setShowDetailDropdown,
  companies,
}: SidePanelProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isDetailPage = pathname.startsWith("/detail");
  const currentCompanyId = isDetailPage ? pathname.split("/")[2] : null;

  useEffect(() => {
    if (isDetailPage) setShowDetailDropdown(true);
  }, [isDetailPage, setShowDetailDropdown]);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
        isDrawerOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full bg-black border-r border-borderCustom shadow-2xl rounded-r-2xl">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-point to-white flex items-center justify-center shadow-md">
              <Leaf className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isDrawerOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 px-4 space-y-2 relative">
          {/* Home 버튼 */}
          <button
            onClick={() => router.push("/")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isHomePage
                ? "bg-gradient-to-r from-point to-white text-white border border-borderCustom shadow-inner"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Globe className="w-5 h-5" />
            <span>Home</span>
          </button>

          {/* Detail Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDetailDropdown((prev) => !prev)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                showDetailDropdown || isDetailPage
                  ? "bg-gradient-to-r from-point to-white text-white border border-borderCustom shadow-inner"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Detail</span>
              <span
                className={`ml-auto transition-transform duration-200 ${
                  showDetailDropdown ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {showDetailDropdown && (
              <div className="absolute left-0 top-full mt-1 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-borderCustom shadow-lg z-50">
                {companies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      router.push(`/detail/${c.id}`);
                      setShowDetailDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                      c.id === currentCompanyId
                        ? "bg-point text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SidePanel;
