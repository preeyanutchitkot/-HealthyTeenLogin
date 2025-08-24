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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3faee",
};


export default function RootLayout({ children }) {
  return (
    <html lang="th" className={notoThai.className}>
      {/* ไม่ต้องใส่ style={{ fontFamily: ... }} แล้ว */}
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
