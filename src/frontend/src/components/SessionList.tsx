import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateSession,
  useDeleteSession,
  useSessions,
} from "@/hooks/useQueries";
import { Clock, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface SessionListProps {
  activeSessionId: bigint | null;
  onSelectSession: (id: bigint) => void;
}

export function SessionList({
  activeSessionId,
  onSelectSession,
}: SessionListProps) {
  const { data: sessions, isLoading } = useSessions();
  const createMutation = useCreateSession();
  const deleteMutation = useDeleteSession();
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const session = await createMutation.mutateAsync(newName.trim());
    setNewName("");
    setDialogOpen(false);
    onSelectSession(session.id);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map(() => (
          <div
            key={crypto.randomUUID()}
            className="h-16 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          Interview Sessions
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="session.create_button"
              size="sm"
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input
                data-ocid="session.name_input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Session name, e.g. Google SDE Round 1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
              <Button
                data-ocid="session.confirm_create_button"
                onClick={handleCreate}
                disabled={!newName.trim() || createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? "Creating..." : "Create Session"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/30">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No sessions yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create a session to start capturing Q&A.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sessions.map((session) => (
            <Card
              key={session.id.toString()}
              data-ocid={`session.item.${session.id.toString()}`}
              className={
                activeSessionId === session.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground/30 transition-smooth cursor-pointer"
              }
              onClick={() => onSelectSession(session.id)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {session.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(
                        Number(session.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {Number(session.qaCount)} Q&A
                    </Badge>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      data-ocid={`session.delete_button.${session.id.toString()}`}
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove &quot;{session.name}&quot;
                        and all its Q&A history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="session.delete_cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid={`session.delete_confirm_button.${session.id.toString()}`}
                        onClick={() => deleteMutation.mutate(session.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
