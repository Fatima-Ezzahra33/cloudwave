import AuthForm from "@/components/AuthForm";

export default function SigninPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-black">
      <AuthForm type="signin" />
    </div>
  );
}
