import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layout/MainLayout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const PoppinsFont = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-poppins",
  subsets: ["latin"],
});
export const metadata = {
  title: "CBI Bank App",
  description: "A Bank for the Coders",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${PoppinsFont.variable}  antialiased`}
        suppressHydrationWarning
      >
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
