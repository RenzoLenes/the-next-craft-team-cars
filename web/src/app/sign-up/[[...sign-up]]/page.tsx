import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#f8fafc] p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#dc2626] shadow-[0_0_0_3px_rgba(220,38,38,0.18)]" />
          <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.2em] uppercase">
            Señal
          </span>
        </div>
        <SignUp signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
