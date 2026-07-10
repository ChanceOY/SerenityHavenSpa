"use client";

import { useState } from "react";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Use Supabase Auth credentials for ADMIN or RECEPTION staff.");

  async function login() {
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      globalThis.location.assign("/staff/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start Supabase login.");
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <Image src="/brand/serenity-haven-logo.jpeg" alt="Serenity Haven Spa logo" width={76} height={76} className="mx-auto h-20 w-20 rounded-full object-cover" />
      <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
        <h1 className="serif text-4xl font-semibold text-[#583d2f]">Serenity Desk</h1>
        <p className="mt-2 text-sm text-[#5f554d]">{message}</p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-[#583d2f]">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-md border px-4 py-3" />
          </label>
          <label className="block text-sm font-semibold text-[#583d2f]">
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-md border px-4 py-3" />
          </label>
          <button type="button" onClick={login} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#583d2f] px-5 py-3 text-sm font-semibold text-white">
            <LogIn size={16} /> Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
