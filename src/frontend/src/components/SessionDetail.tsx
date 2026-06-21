import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/hooks/useQueries";
import { Clock, MessageSquare } from "lucide-react";

interface SessionDetailProps {
  sessionId: bigint;
}

export function SessionDetail({ sessionId }: SessionDetailProps) {
  const { data: session, isLoading } = useSession(sessionId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-40 bg-muted rounded animate-pulse" />
        {Array.from({ length: 3 }).map(() => (
          <div
            key={crypto.randomUUID()}
            className="h-24 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Session not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">{session.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {new Date(Number(session.createdAt) / 1_000_000).toLocaleString()}
            <Badge variant="secondary" className="text-[10px]">
              {session.qaPairs.length} Q&A
            </Badge>
          </div>
        </div>
      </div>

      {session.qaPairs.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-xl bg-muted/30">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No Q&A pairs yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Use the Live Coach overlay to capture questions and generate
            answers.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {session.qaPairs.map((qa, idx) => (
            <Card
              key={qa.id.toString()}
              data-ocid={`qa.item.${idx + 1}`}
              className="border-border bg-card"
            >
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="text-[10px] font-medium text-primary uppercase tracking-wider mb-1">
                    Question
                  </div>
                  <p className="text-sm text-foreground">{qa.question}</p>
                </div>
                <div className="border-t border-border/50 pt-3">
                  <div className="text-[10px] font-medium text-accent uppercase tracking-wider mb-1">
                    Answer
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {qa.answer}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(Number(qa.timestamp) / 1_000_000).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
