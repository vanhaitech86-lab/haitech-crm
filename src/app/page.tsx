'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false ensures browser localStorage and singleton state initialize smoothly
const AppShell = dynamic(
  () => import('@/components/layout/AppShell').then((mod) => mod.AppShell),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F0F6FA] text-[#0A2540]">
        <div className="w-14 h-14 bg-[#0284C7] rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-bounce">
          <span className="text-white font-extrabold text-xl tracking-wider">H</span>
        </div>
        <div className="text-sm font-bold tracking-wider text-[#0A2540]">HAITECH CRM</div>
        <div className="text-xs text-sky-700 mt-1">Đang khởi động hệ thống đa kênh...</div>
      </div>
    ),
  }
);

export default function HomePage() {
  return <AppShell />;
}
