import "./globals.css";
import { Metadata } from "next";
import "/public/assets/css/custom.css";
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from "next/font/google";
import { Providers } from "@/redux/provider";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Course Admin Dashboard",
  description: "Modern course administration platform",
};

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`font-sans antialiased ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
