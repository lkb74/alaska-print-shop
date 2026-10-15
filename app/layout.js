import './globals.css';

export const metadata = {
  title: 'FBKR_CGDemo - 인쇄 쇼핑몰',
  description: '디지털인쇄, 옵셋인쇄, 책자, 카탈로그, 리플렛 제작 전문',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
