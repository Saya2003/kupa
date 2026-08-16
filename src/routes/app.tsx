import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useConvexAuth } from "@convex-dev/auth/react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/app")({
  component: AppShellWithAuth,
});

function AppShellWithAuth() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/signin" });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-aura">
        <Loader2 className="size-6 animate-spin text-plum" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell />;
}
