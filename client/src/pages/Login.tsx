import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      console.log('[Login] Usuario logueado:', { email: data.user.email, role: data.user.role });
      
      // Invalidar y refetch the auth.me query
      await utils.auth.me.invalidate();
      await utils.auth.me.refetch();
      
      console.log('[Login] Cache invalidado y refetchado');
      
      // Navegar basado en el rol retornado
      if (data.user.role === "admin") {
        console.log('[Login] Redirigiendo a /admin');
        setLocation("/admin");
      } else {
        console.log('[Login] Redirigiendo a /dashboard');
        setLocation("/dashboard");
      }
      toast.success("¡Bienvenido!");
    },
    onError: (err) => {
      console.error('[Login] Error:', err.message);
      setError(err.message);
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    console.log('[Login] Iniciando login con:', email);
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#080B12] to-[#0a1628] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00E5A0] to-[#22D3EE] flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="text-2xl font-bold text-white">Videxa Studio</span>
          </div>
          <p className="text-gray-400">Inicia sesión en tu cuenta</p>
        </div>

        {/* Login Card */}
        <Card className="border-gray-700 bg-gray-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Iniciar Sesión</CardTitle>
            <CardDescription>Usa tu email y contraseña para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gradient-to-r from-[#00E5A0] to-[#22D3EE] text-gray-900 font-semibold hover:opacity-90"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setLocation("/forgot-password")}
                  className="text-sm text-gray-400 hover:text-[#00E5A0] transition"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => setLocation("/register")}
                  className="text-[#00E5A0] hover:text-[#22D3EE] font-semibold transition"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setLocation("/")}
                className="text-sm text-gray-500 hover:text-gray-300 transition"
              >
                Volver al inicio
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
