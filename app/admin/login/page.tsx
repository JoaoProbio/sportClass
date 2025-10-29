"use client";

import Image from "next/image";
import React, { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/app/providers/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, senha);

      if (success) {
        router.push("/admin/dashboard");
        return;
      }

      setError("Credenciais inválidas ou acesso negado");
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-color-variant-lightGreen px-4">
      <Dialog defaultOpen>
        <DialogTrigger asChild>
          <Button className="outline-none">
            Acessar painel administrativo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[420px] space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <Image
                src="/logo/logo_rapoze_darkGreen.svg"
                alt="Logo do Interclasse"
                fill
                sizes="64px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input
                  id={`${id}-email`}
                  type="email"
                  placeholder="admin@escola.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-password`}>Senha</Label>
                <Input
                  id={`${id}-password`}
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  required
                />
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
