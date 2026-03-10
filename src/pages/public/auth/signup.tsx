import { SignUpForm } from "@/forms/sign-up-form";
import logo from "@/assets/logo.png";

export function SignUp() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 md:p-8 overflow-x-hidden">
      <div className="flex w-full max-w-[1200px] flex-col items-center justify-center">
        <div className="w-full max-w-[440px] flex flex-col items-start space-y-10 py-8">
          <img src={logo} alt="Logo Gabinete Digital" className="h-12 w-auto object-contain" />
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}