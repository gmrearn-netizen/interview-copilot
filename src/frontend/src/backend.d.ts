import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface SessionSummary {
    id: SessionId;
    qaCount: bigint;
    name: string;
    createdAt: Timestamp;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface InterviewSession {
    id: SessionId;
    name: string;
    createdAt: Timestamp;
    qaPairs: Array<QAPair>;
}
export type SessionId = bigint;
export type QAPairId = bigint;
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface UserProfile {
    age?: bigint;
    experienceLevel?: ExperienceLevel;
    preferredLanguage?: string;
    name: string;
    education?: string;
    degree?: string;
    targetRole?: string;
    targetCompany?: string;
    skills: Array<string>;
}
export interface QAPair {
    id: QAPairId;
    question: string;
    answer: string;
    timestamp: Timestamp;
}
export enum ExperienceLevel {
    mid = "mid",
    junior = "junior",
    lead = "lead",
    senior = "senior",
    fresher = "fresher"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addQAPairToSession(sessionId: SessionId, question: string, answer: string): Promise<QAPair | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearMyOpenAIApiKey(): Promise<void>;
    createInterviewSession(name: string): Promise<InterviewSession>;
    deleteInterviewSession(sessionId: SessionId): Promise<boolean>;
    generateInterviewAnswer(question: string): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInterviewSession(sessionId: SessionId): Promise<InterviewSession | null>;
    isCallerAdmin(): Promise<boolean>;
    isMyOpenAIConfigured(): Promise<boolean>;
    listInterviewSessions(): Promise<Array<SessionSummary>>;
    regenerateInterviewAnswer(question: string, previousAnswer: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setMyOpenAIApiKey(key: string): Promise<void>;
}
