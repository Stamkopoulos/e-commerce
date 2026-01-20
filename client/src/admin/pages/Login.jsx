import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        path="/admin/login"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/admin"
      />
    </div>
  );
}
