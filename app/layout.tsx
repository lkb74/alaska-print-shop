import React from 'react';
import './globals.css'; // 테일윈드 스타일 연동

export const metadata = {
  title: '알래스카인디고 인쇄 쇼핑몰',
  description: '실시간 인쇄 자동견적 및 원고 검수 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
