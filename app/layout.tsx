import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ติดตามสถานะออเดอร์ | Trackly',
  description: 'ตรวจสอบสถานะคำสั่งซื้อและประวัติออเดอร์ของคุณได้ง่าย ๆ ในที่เดียว',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
