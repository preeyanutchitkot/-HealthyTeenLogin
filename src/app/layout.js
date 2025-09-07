// app/layout.js
import "./globals.css";
import { Noto_Sans_Thai } from "next/font/google";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "Healthy Teen",
  description: "Agreement & Privacy",
  other: {
    "format-detection": "telephone=no", // กัน iOS ทำเบอร์เป็นลิงก์+ซูม
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,          // 🔒 กันซูม
  userScalable: "no",       // 🔒 กัน pinch-zoom ทั้งแอป
  viewportFit: "cover",
  themeColor: "#f3faee",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={notoThai.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
