import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts';
import Navbar from "@/app/ui/home/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
      </body>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}




