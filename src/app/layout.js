<<<<<<< Updated upstream
import { Geist, Geist_Mono } from "next/font/google";
=======
// app/layout.js
>>>>>>> Stashed changes
import "./globals.css";
import { Noto_Sans_Thai } from "next/font/google";

<<<<<<< Updated upstream
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

=======
const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
=======
    <html lang="th" className={notoThai.className}>
      {/* ไม่ต้องใส่ style={{ fontFamily: ... }} แล้ว */}
      <body className="antialiased">
>>>>>>> Stashed changes
        {children}
      </body>
    </html>
  );
}
