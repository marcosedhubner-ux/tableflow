"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/apiClient";

const DEMO_ACCOUNTS = [
  { role: "Manager", email: "manager@tableflow.dev" },
  { role: "Server", email: "server@tableflow.dev" },
  { role: "Kitchen", email: "kitchen@tableflow.dev" },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    login.mutate(
      { email, password },
      {
        onSuccess: () => router.push("/"),
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#151312] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#1e1b19] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,#ff5a3c_0px,#ff5a3c_2px,transparent_2px,transparent_18px)]"
          aria-hidden
        />
        <div className="relative z-10">
          <span className="font-heading text-2xl font-bold uppercase tracking-wide text-[#ff5a3c]">
            The Pass
          </span>
        </div>
        <div className="relative z-10 space-y-4">
          <p className="max-w-md font-heading text-3xl font-semibold leading-tight text-[#f5efe9]">
            Table and kitchen status share one brain.
          </p>
          <p className="max-w-sm text-sm text-[#a89e97]">
            Pay the check and the table&apos;s free before the busser even gets there. Servers see
            live table status, the kitchen sees tickets the moment they fire, and managers watch
            revenue update in real time.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#f5efe9]">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-[#a89e97]">Use your staff account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wide text-[#a89e97]"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-sm border-2 border-[#2a2523] bg-[#1e1b19] px-3 py-2 text-sm text-[#f5efe9] outline-none focus:border-[#ff5a3c]"
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wide text-[#a89e97]"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-sm border-2 border-[#2a2523] bg-[#1e1b19] px-3 py-2 text-sm text-[#f5efe9] outline-none focus:border-[#ff5a3c]"
              />
            </div>

            {errorMessage && (
              <p className="rounded-sm border border-[#6b3a30] bg-[rgba(224,74,54,0.14)] px-3 py-2 text-sm text-[#e88a78]">
                {errorMessage}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 rounded-sm border-2 border-dashed border-[#2a2523] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#a89e97]">
              Demo accounts (password: Passw0rd!123)
            </p>
            <ul className="mt-2 space-y-1">
              {DEMO_ACCOUNTS.map((account) => (
                <li key={account.email} className="flex justify-between text-xs text-[#a89e97]">
                  <span>{account.role}</span>
                  <span className="font-mono">{account.email}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
