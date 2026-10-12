import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/folio/login-screen";

export const Route = createFileRoute("/login")({ component: LoginScreen });
