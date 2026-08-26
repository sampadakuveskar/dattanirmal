import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/site/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : "/account",
  }),
  head: () => ({
    meta: [
      { title: "Sign In or Create Account | Konkan Kokani Farms" },
      {
        name: "description",
        content: "Sign in to track your Devgad Alphonso orders, save addresses and manage your wishlist.",
      },
      { property: "og:title", content: "Sign In | Konkan Kokani Farms" },
      { property: "og:description", content: "Access your Konkan Kokani Farms account and orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function safePath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

function AuthPage() {
  const { redirect } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const target = safePath(redirect);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target, replace: true });
    });
  }, [navigate, target]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await navigate({ to: target, replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${target}`,
        data: { full_name: fullName, phone },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (data.session) return navigate({ to: target, replace: true });
    setSent(true);
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    await navigate({ to: target, replace: true });
  }

  return (
    <>
      <PageHero eyebrow="Account" title="Sign in to Konkan Kokani" description="Track orders, save addresses and check out faster." />
      <div className="container-page py-12">
        <div className="surface-card mx-auto max-w-md p-7">
          {sent ? (
            <div className="space-y-3 text-center">
              <h2 className="font-serif text-2xl">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation link to {email}. Click it to activate your account.
              </p>
            </div>
          ) : (
            <>
              <Button variant="outline" className="w-full" onClick={google} type="button">
                Continue with Google
              </Button>
              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>

              <Tabs defaultValue="signin">
                <TabsList className="w-full">
                  <TabsTrigger value="signin" className="flex-1">
                    Sign in
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1">
                    Create account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form className="space-y-4 pt-6" onSubmit={signIn}>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
                    </div>
                    <Button type="submit" className="w-full" disabled={busy}>
                      Sign in
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form className="space-y-4 pt-6" onSubmit={signUp}>
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="email2">Email</Label>
                      <Input id="email2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="password2">Password</Label>
                      <Input id="password2" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
                    </div>
                    <Button type="submit" className="w-full" disabled={busy}>
                      Create account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </>
  );
}
