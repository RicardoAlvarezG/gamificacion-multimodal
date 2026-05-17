import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "administrador" | "docente";
  name: string;
  userId: string;
  institutionName?: string;
}

export default function DashboardLayout({
  children,
  role,
  name,
  userId,
  institutionName,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-sky-100 flex">
      <Sidebar role={role} />

      <section className="flex-1 p-6">
        <Header
          role={role}
          name={name}
          userId={userId}
          institutionName={institutionName}
      />

        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}