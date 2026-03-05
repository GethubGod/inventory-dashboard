"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useSupabase } from "@/components/providers/supabase-provider";

/* ─── Schema (no confirm-password) ─────────────────── */

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain letters and numbers."
    ),
});

type SignupValues = z.infer<typeof signupSchema>;

/* ─── Page ─────────────────────────────────────────── */

export default function SignupPage() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created. Check your inbox to confirm your email.");
    router.push("/login");
  });

  return (
    <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-lime-500/5">
      {/* ─── Left: Form Panel ─────────────────────────── */}
      <div className="flex w-full flex-col justify-center bg-zinc-950 px-8 py-12 sm:px-12 lg:w-1/2">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-white">
          Create your account
        </h1>

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Full name */}
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-zinc-300"
            >
              Full name
            </label>
            <input
              id="fullName"
              autoComplete="name"
              placeholder="Jamie Patel"
              {...register("fullName")}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/30"
            />
            {errors.fullName && (
              <p className="text-xs text-red-400">{errors.fullName.message}</p>
            )}
          </div>

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
              autoComplete="new-password"
              placeholder="Min 8 characters"
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
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-lime-400 transition-colors hover:text-lime-300"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>

      {/* ─── Right: Motto Panel (desktop only) ──────── */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-zinc-900 lg:flex">
        {/* Gradient glow backdrop */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-lime-500/10 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-500/10 blur-[80px]" />

        <div className="relative z-10 px-10 text-center">
          <h2 className="text-5xl font-bold leading-tight tracking-tight text-white">
            Inventory{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-lime-400">
              reimagined.
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}
