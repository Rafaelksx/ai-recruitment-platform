import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 md:p-10 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
}
