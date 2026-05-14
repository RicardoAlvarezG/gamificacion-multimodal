import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-pink-100 to-yellow-50 flex">
      <Sidebar />

      <section className="flex-1 p-6">
        <Header />

        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}