"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      login(data);
      
      if (data.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/perfil");
      }
    } catch (error: any) {
      toast.error("Erro ao fazer login. Verifique seu login e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-margin-mobile">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2">
            <h1 className="font-display text-4xl font-extrabold text-on-background">Bem-vindo de volta!</h1>
            <p className="text-on-surface-variant italic">Entre para acompanhar seus pedidos e aproveitar ofertas exclusivas.</p>
          </div>

          <form onSubmit={handleLogin} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-xl flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <Link href="#" className="text-xs text-primary font-bold hover:underline self-end mt-1">Esqueceu a senha?</Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-display text-lg font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Entrar na Conta"}
            </button>

            <div className="flex flex-col gap-4 mt-2">
              <p className="text-center text-sm text-on-surface-variant">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se</Link>
              </p>
            </div>
          </form>

          <Link href="/" className="flex items-center justify-center gap-2 text-outline hover:text-on-background transition-colors font-label">
            Voltar para a loja
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
