import { Layout } from "@/components/Layout";
import { ProfileForm } from "@/components/ProfileForm";
import { SessionDetail } from "@/components/SessionDetail";
import { SessionList } from "@/components/SessionList";
import { SettingsPanel } from "@/components/SettingsPanel";
import { StealthOverlay } from "@/components/StealthOverlay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile, useSessions } from "@/hooks/useQueries";
import type { ViewMode } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  ArrowRight,
  History,
  LogIn,
  MessageSquare,
  Mic,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function App() {
  const [view, setView] = useState<ViewMode>("dashboard");
  const [activeSessionId, setActiveSessionId] = useState<bigint | null>(null);
  const { isAuthenticated } = useInternetIdentity();

  const { data: profile } = useProfile();
  const { data: sessions } = useSessions();

  const renderView = () => {
    switch (view) {
      case "overlay":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-semibold">
                Live Coach Overlay
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                The stealth overlay is active. Drag it anywhere on screen,
                adjust opacity, and use it during your interview.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {activeSessionId ? "Session Active" : "No Session"}
                </Badge>
                {!activeSessionId && (
                  <Button
                    data-ocid="overlay.goto_sessions_button"
                    size="sm"
                    variant="outline"
                    onClick={() => setView("sessions")}
                  >
                    Select Session <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>

            {profile && (
              <Card className="border-border bg-card max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Active Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Role</span>
                    <span className="font-medium">
                      {profile.targetRole || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium capitalize">
                      {profile.experienceLevel || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills</span>
                    <span className="font-medium">
                      {profile.skills.slice(0, 3).join(", ")}
                      {profile.skills.length > 3 ? "..." : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4 py-8">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto shadow-subtle">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient">
                Interview AI Coach
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
                Real-time audio capture, AI-generated answers, and session
                management — all in a stealthy overlay designed for screen
                shares.
              </p>
              {!isAuthenticated && (
                <Button
                  data-ocid="dashboard.login_button"
                  onClick={() => {
                    /* login handled by Layout */
                  }}
                  className="gap-2 mt-2"
                >
                  <LogIn className="w-4 h-4" /> Login to Get Started
                </Button>
              )}
            </div>

            {/* Stats */}
            {isAuthenticated && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-border bg-card">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-semibold">
                        {sessions?.length ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sessions
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <History className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-semibold">
                        {sessions?.reduce(
                          (acc, s) => acc + Number(s.qaCount),
                          0,
                        ) ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Q&A Pairs
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-semibold">
                        {profile?.skills?.length ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Skills
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick actions */}
            {isAuthenticated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className="border-border bg-card hover:border-primary/30 transition-smooth cursor-pointer"
                  onClick={() => setView("overlay")}
                >
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-primary" />
                      <span className="font-medium">Open Live Coach</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Launch the stealth overlay to capture audio and generate
                      answers in real time.
                    </p>
                  </CardContent>
                </Card>
                <Card
                  className="border-border bg-card hover:border-primary/30 transition-smooth cursor-pointer"
                  onClick={() => setView("sessions")}
                >
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-accent" />
                      <span className="font-medium">Manage Sessions</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Create, view, and organize your interview sessions with
                      full Q&A history.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold">
                Your Profile
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Set your target role, experience, and skills so AI answers are
                tailored for you.
              </p>
            </div>
            <ProfileForm />
          </div>
        );

      case "sessions":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold">Sessions</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage interview sessions and review captured Q&A history.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <SessionList
                  activeSessionId={activeSessionId}
                  onSelectSession={(id) => setActiveSessionId(id)}
                />
              </div>
              <div className="lg:col-span-2">
                {activeSessionId ? (
                  <SessionDetail sessionId={activeSessionId} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px] border border-dashed border-border rounded-xl bg-muted/30">
                    <History className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Select a session to view details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold">Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure API keys and application preferences.
              </p>
            </div>
            <SettingsPanel />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Layout view={view} onChangeView={setView}>
        {renderView()}
      </Layout>
      {isAuthenticated && view === "overlay" && (
        <StealthOverlay activeSessionId={activeSessionId} />
      )}
    </>
  );
}
