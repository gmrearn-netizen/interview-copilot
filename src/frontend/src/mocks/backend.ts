import type { backendInterface } from "../backend";
import { ExperienceLevel, UserRole } from "../backend";
import { Principal } from "@icp-sdk/core/principal";

export const mockBackend: backendInterface = {
  __accessControlState: async () => ({}),
  __openAIKeys: async () => [],
  __qaCounter: async () => BigInt(0),
  __sessionCounter: async () => BigInt(0),
  __sessions: async () => [],
  __userProfiles: async () => [],
  _initialize_access_control: async () => undefined,
  _internet_identity_sign_in_finish: async () => ({ __kind__: "ok" as const, ok: null }),
  _internet_identity_sign_in_start: async () => new Uint8Array(0),
  addQAPairToSession: async () => ({
    id: BigInt(1),
    question: "What is your greatest strength?",
    answer: "I would say my greatest strength is my ability to learn quickly and adapt to new challenges. In my previous role, I had to pick up a new programming language within two weeks to meet a project deadline, and I was able to deliver quality code on time.",
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  assignCallerUserRole: async () => undefined,
  clearMyOpenAIApiKey: async () => undefined,
  createInterviewSession: async (name: string) => ({
    id: BigInt(1),
    name,
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    qaPairs: [],
  }),
  deleteInterviewSession: async () => true,
  generateInterviewAnswer: async (question: string) =>
    `That's a great question! Let me think about this carefully. Regarding "${question}", I believe the best approach is to focus on your relevant experience and how it aligns with the role. Be specific, use examples, and show enthusiasm for the opportunity.`,
  getCallerUserProfile: async () => ({
    name: "Rahul Sharma",
    age: BigInt(24),
    education: "B.Tech",
    degree: "Computer Science",
    targetRole: "Software Engineer",
    targetCompany: "Google",
    preferredLanguage: "Hindi (Hinglish)",
    experienceLevel: ExperienceLevel.fresher,
    skills: ["JavaScript", "React", "Node.js", "Python"],
  }),
  getCallerUserRole: async () => UserRole.user,
  getInterviewSession: async (sessionId: bigint) => ({
    id: sessionId,
    name: "Google SDE Round 1",
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    qaPairs: [
      {
        id: BigInt(1),
        question: "Tell me about yourself.",
        answer: "Hi, I'm Rahul. I recently graduated with a B.Tech in Computer Science. I'm passionate about building scalable web applications and have experience with React, Node.js, and Python. I'm excited about the opportunity to contribute to Google's innovative products.",
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      },
    ],
  }),
  isCallerAdmin: async () => false,
  isMyOpenAIConfigured: async () => true,
  listInterviewSessions: async () => [
    {
      id: BigInt(1),
      name: "Google SDE Round 1",
      qaCount: BigInt(3),
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
    {
      id: BigInt(2),
      name: "Amazon Interview Prep",
      qaCount: BigInt(0),
      createdAt: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
    },
  ],
  regenerateInterviewAnswer: async (question: string, previousAnswer: string) =>
    `Here's another way to approach "${question}": I would emphasize my problem-solving skills and teamwork. In college, I led a team of 4 to build a hackathon project in 24 hours, which taught me how to collaborate under pressure and deliver results quickly.`,
  saveCallerUserProfile: async () => undefined,
  setMyOpenAIApiKey: async () => undefined,
};
