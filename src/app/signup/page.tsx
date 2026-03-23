import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#111] dot-grid noise relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#e8351e]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/3 rounded-full blur-[80px] pointer-events-none" />
      <AuthForm type="signup" />
    </div>
  );
}
