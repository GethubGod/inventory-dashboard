import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Organization onboarding required</CardTitle>
          <CardDescription>
            Your account is authenticated, but no organization membership was found. Complete onboarding to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Create an organization and membership row in Supabase, then reload to enter the dashboard.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
