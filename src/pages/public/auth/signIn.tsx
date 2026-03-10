import { SignInForm } from "@/forms/sign-in-form";

export function SignIn() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md space-y-8">
                        <SignInForm />
                    </div>
                </div>
            </div>
        </div>
    )
}