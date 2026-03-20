"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md bg-base-200 border border-base-300 shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/50 from-success to-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserPlus className="w-7 h-7 text-primary-content" />
            </div>
            <h1 className="text-2xl font-bold">Kayıt Ol</h1>
            <p className="text-base-content/50 text-sm mt-1">
              Yeni hesap oluşturarak film takibine başlayın
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Kullanıcı Adı</span>
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full focus-within:outline-none focus-within:border-primary/50 transition-colors duration-200">
                <User className="w-4 h-4 opacity-40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kullanici_adi"
                  className="grow"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">E-posta</span>
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full focus-within:outline-none focus-within:border-primary/50 transition-colors duration-200">
                <Mail className="w-4 h-4 opacity-40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Şifre</span>
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full focus-within:outline-none focus-within:border-primary/50 transition-colors duration-200">
                <Lock className="w-4 h-4 opacity-40" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="grow"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="btn btn-ghost btn-xs btn-circle"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Şifre Tekrar</span>
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full focus-within:outline-none focus-within:border-primary/50 transition-colors duration-200">
                <Lock className="w-4 h-4 opacity-40" />
                <input
                  type={showPass ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="grow"
                  required
                  minLength={6}
                />
              </label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Kayıt Ol"
              )}
            </button>
          </form>

          <div className="divider text-xs text-base-content/30">veya</div>

          <p className="text-center text-sm text-base-content/60">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="link font-medium">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
