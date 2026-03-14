"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useSupabase } from "@/components/providers/supabase-provider";
import { useApi } from "@/hooks/use-api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const api = useApi();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back.");

    const { data: ctx } = await api.getUserContext();
    const hasMembership = !!ctx?.membership?.orgId;

    router.push(hasMembership ? "/dashboard/overview" : "/onboarding");
    router.refresh();
  });

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 px-8 py-12 shadow-2xl sm:px-12">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-white">
        Log in
      </h1>

      <form className="space-y-5" onSubmit={onSubmit}>
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="chef@restaurant.com"
            {...register("email")}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/30"
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/30"
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-lime-500 py-2.5 text-sm font-semibold text-black transition-all hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          New to Babytuna?{" "}
          <Link
            href="/signup"
            className="font-medium text-lime-400 transition-colors hover:text-lime-300"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
