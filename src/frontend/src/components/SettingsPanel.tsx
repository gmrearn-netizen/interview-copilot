import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useClearOpenAIKey,
  useIsOpenAIConfigured,
  useSetOpenAIKey,
} from "@/hooks/useQueries";
import { AlertCircle, Check, Key, Trash2 } from "lucide-react";
import { useState } from "react";

export function SettingsPanel() {
  const { data: isConfigured, isLoading } = useIsOpenAIConfigured();
  const setKeyMutation = useSetOpenAIKey();
  const clearKeyMutation = useClearOpenAIKey();
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    await setKeyMutation.mutateAsync(apiKey.trim());
    setApiKey("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = async () => {
    await clearKeyMutation.mutateAsync();
  };

  return (
    <div className="space-y-6 max-w-xl">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            OpenAI API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              variant={isConfigured ? "default" : "secondary"}
              className={isConfigured ? "bg-success/20 text-success" : ""}
            >
              {isLoading
                ? "Checking..."
                : isConfigured
                  ? "Configured"
                  : "Not Configured"}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex items-center gap-2">
              <Input
                id="apiKey"
                data-ocid="settings.api_key_input"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <Button
                data-ocid="settings.save_key_button"
                onClick={handleSave}
                disabled={!apiKey.trim() || setKeyMutation.isPending}
              >
                {saved ? <Check className="w-4 h-4" /> : "Save"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your key is stored securely in the backend and never shared.
            </p>
          </div>

          {isConfigured && (
            <Button
              data-ocid="settings.clear_key_button"
              variant="destructive"
              size="sm"
              onClick={handleClear}
              disabled={clearKeyMutation.isPending}
              className="gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Key
            </Button>
          )}

          {setKeyMutation.isError && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              Failed to save key. Please try again.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Interview AI Coach helps you prepare for interviews with real-time
            audio capture, AI-generated answers, and session management.
          </p>
          <p>
            Set your OpenAI API key to enable answer generation. Your key is
            stored securely and used only for generating interview responses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
