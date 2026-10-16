import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HAITECH CRM — AI All-in-One Omnichannel CRM Platform',
  description:
    'Hệ thống CRM hợp nhất đa kênh Facebook Messenger, Zalo cá nhân, Zalo OA, Telegram, TikTok và Website Livechat tích hợp AI Subagent tự động hóa.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
