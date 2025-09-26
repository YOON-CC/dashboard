"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Company, fetchCompanies } from "@/lib/api";
import SidePanel from "@/components/layout/SidePanel";
import Header from "@/components/layout/Header";

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id;

  console.log(companyId);

  const [showDetailDropdown, setShowDetailDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // 데이터 상태
  const [companies, setCompanies] = useState<Company[]>([]);

  // 데이터 로딩
  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);

  return (
    <div
      className="flex min-h-screen relative overflow-hidden bg-cover bg-center p-6 items-center justify-center"
      style={{
        backgroundImage: "url('/images/dashboard-bg.jpg')",
      }}
    >
      {/* 메인 */}
      <div className="h-full w-full min-w-0 rounded-3xl backdrop-blur-[12px] bg-black/10 border border-white/20 shadow-2xl overflow-auto p-3">
        {/* 사이드패널 */}
        <SidePanel
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          showDetailDropdown={showDetailDropdown}
          setShowDetailDropdown={setShowDetailDropdown}
          companies={companies}
        />

        {/* 헤더 */}
        <Header isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
        <div className="h-[820px]">{/* 내용 */}</div>
      </div>
    </div>
  );
}
