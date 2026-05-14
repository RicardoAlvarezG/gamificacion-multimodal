import AuthPanel from "@/components/layout/AuthPanel";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-200 via-pink-200 to-yellow-100 flex items-center justify-center p-6">
      <section className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <AuthPanel />
        <LoginForm />
      </section>
    </main>
  );
}