import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const user = await auth.getCurrentUser();
    if (user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  return <AuthForm />;
}
