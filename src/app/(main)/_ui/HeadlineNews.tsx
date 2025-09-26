"use client";

import { Newspaper } from "lucide-react";
import { mockNews } from "../_mock/mockNews";

interface HeadlineNewsProps {
  selectedCompanyId?: string | null;
}

const HeadlineNews = ({ selectedCompanyId }: HeadlineNewsProps) => {
  return (
    <div className="w-fullmx-auto">
      <div className="bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden">
        {/* 데코 배경 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>

        {/* 헤더 */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-green-400" />
          헤드라인 뉴스 Top 10
        </h3>

        {/* 뉴스 리스트 */}
        <div className="grid gap-8">
          <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            {!selectedCompanyId && (
              <div className="space-y-2">
                <div className="overflow-hidden h-64 relative">
                  <ul className="space-y-3 text-white/80 text-sm animate-slide-up">
                    {[...mockNews, ...mockNews].slice(0, 20).map((n, index) => (
                      <li
                        key={`${n.id}-${index}`}
                        className="flex items-center space-x-2 py-1"
                      >
                        <div className="w-2 h-2 bg-green-700 rounded-full flex-shrink-0"></div>
                        <span>{n.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-slide-up {
          animation: slide-up 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeadlineNews;
