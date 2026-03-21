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
    <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900/50 rounded-xl border border-zinc-800 backdrop-blur-md">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {type === "signup" ? "Create an account" : "Welcome back"}
        </h2>
        <p className="text-zinc-400">
          {type === "signup"
            ? "Enter your details to join Cloudwave"
            : "Enter your credentials to access your library"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type === "signup" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <input
                {...register("firstName")}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <input
                {...register("lastName")}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
              />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message as string}</p>}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-full transition-all"
        >
          {isSubmitting ? "Processing..." : type === "signup" ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-sm text-zinc-400">
        {type === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/signin" className="text-accent hover:underline">
              Sign In
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
