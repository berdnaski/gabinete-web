import { SignUpForm } from "@/forms/sign-up-form";

export function SignUp() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  )
}