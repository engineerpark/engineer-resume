import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout';

export const metadata: Metadata = {
  title: '공대 전화기 - 경력기술서 생성기',
  description: '공학 분야 경력직을 위한 경력기술서 및 자기소개서 생성기',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
