import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import { BASE_PATH } from "@/lib/data";
import "./globals.css";
import { LenisProvider } from "@/components/lenis-provider";
import { AmbientSound } from "@/components/ambient-sound";

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "盛世之后 — 唐人视野中的王朝衰亡",
  description:
    "基于唐代文献的数字人文研究：探索唐人自认为王朝何时走向衰落，安史之乱记忆与衰亡叙事的演变（762—907）",
  authors: [{ name: "刘彦辰、张浩歌" }],
  openGraph: {
    title: "盛世之后 — 唐人视野中的王朝衰亡",
    description: "安史之乱记忆与衰亡叙事的演变（762—907）",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={notoSerif.variable}>
      <body>
        <LenisProvider>{children}</LenisProvider>
        <AmbientSound />
      </body>
    </html>
  );
}
