"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, signinSchema } from "@/lib/schemas";
import { signIn } from "next-auth/react";
import { signup as signupAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthFormProps {
  type: "signin" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(type === "signup" ? signupSchema : signinSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (type === "signup") {
        const result = await signupAction(data);
        if (result?.serverError) {
          setError(result.serverError);
          return;
        }
        // After signup, sign in automatically
        const signinResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (signinResult?.error) {
             setError("Signup successful, but login failed. Please sign in manually.");
             return;
        }
        router.push("/home");
      } else {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
        } else {
          router.push("/home");
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-10 space-y-8 bg-zinc-900/40 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden noise dot-grid">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <div className="w-10 h-10 rounded-full bg-[#e8351e] flex items-center justify-center shadow-lg shadow-[#e8351e]/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
            </svg>
          </div>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white display">
          {type === "signup" ? "Get Started" : "Welcome Back"}
        </h2>
        <p className="text-white/50 text-sm font-medium">
          {type === "signup"
            ? "Join the wave of fresh music"
            : "Sign in to continue your vibe"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        {type === "signup" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">First Name</label>
              <input
                {...register("firstName")}
                placeholder="John"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#e8351e]/50 focus:bg-white/10 transition-all text-sm"
              />
              {errors.firstName && <p className="text-[10px] font-bold text-[#e8351e] mt-1 ml-1 uppercase">{errors.firstName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Last Name</label>
              <input
                {...register("lastName")}
                placeholder="Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#e8351e]/50 focus:bg-white/10 transition-all text-sm"
              />
              {errors.lastName && <p className="text-[10px] font-bold text-[#e8351e] mt-1 ml-1 uppercase">{errors.lastName.message as string}</p>}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
          <input
            {...register("email")}
            type="email"
            placeholder="name@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#e8351e]/50 focus:bg-white/10 transition-all text-sm"
          />
          {errors.email && <p className="text-[10px] font-bold text-[#e8351e] mt-1 ml-1 uppercase">{errors.email.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#e8351e]/50 focus:bg-white/10 transition-all text-sm"
          />
          {errors.password && <p className="text-[10px] font-bold text-[#e8351e] mt-1 ml-1 uppercase">{errors.password.message as string}</p>}
        </div>

        {error && <p className="text-xs font-bold text-[#e8351e] text-center bg-[#e8351e]/10 py-2 rounded-lg">{error}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#e8351e] hover:bg-[#c8291a] text-white font-bold py-4 rounded-full transition-all shadow-lg shadow-[#e8351e]/20 active:scale-[0.98]"
        >
          {isSubmitting ? "Processing..." : type === "signup" ? "Create Account" : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-xs font-medium text-white/40 relative z-10">
        {type === "signup" ? (
          <>
            Already a member?{" "}
            <Link href="/signin" className="text-white hover:text-[#e8351e] font-bold transition-colors">
              Sign In
            </Link>
          </>
        ) : (
          <>
            New to Cloudwave?{" "}
            <Link href="/signup" className="text-white hover:text-[#e8351e] font-bold transition-colors">
              Join Now
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
