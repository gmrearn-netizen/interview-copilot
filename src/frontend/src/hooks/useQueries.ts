import { createActor } from "@/backend";
import type {
  ExperienceLevel,
  InterviewSession,
  QAPair,
  SessionSummary,
  UserProfile,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useSessions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SessionSummary[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInterviewSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSession(sessionId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InterviewSession | null>({
    queryKey: ["session", sessionId?.toString()],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getInterviewSession(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createInterviewSession(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (sessionId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteInterviewSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useAddQAPair() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      sessionId,
      question,
      answer,
    }: {
      sessionId: bigint;
      question: string;
      answer: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addQAPairToSession(sessionId, question, answer);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["session", vars.sessionId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useGenerateAnswer() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (question: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateInterviewAnswer(question);
    },
  });
}

export function useRegenerateAnswer() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      question,
      previousAnswer,
    }: {
      question: string;
      previousAnswer: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.regenerateInterviewAnswer(question, previousAnswer);
    },
  });
}

export function useIsOpenAIConfigured() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["openai-configured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isMyOpenAIConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetOpenAIKey() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setMyOpenAIApiKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openai-configured"] });
    },
  });
}

export function useClearOpenAIKey() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.clearMyOpenAIApiKey();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openai-configured"] });
    },
  });
}
