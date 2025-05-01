import Navbar from '@/app/ui/home/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex h-screen flex-col md:overflow-hidden">
        <div className="w-full flex-none">
          <Navbar />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-8">{children}</div>
      </div>
  );
}