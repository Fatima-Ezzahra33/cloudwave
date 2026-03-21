import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-black">
      <AuthForm type="signup" />
    </div>
  );
}
