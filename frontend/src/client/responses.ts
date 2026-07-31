import type { RawActivity } from "../model/application-data";

export interface CreateSessionResponse {
  sessionId: string;
  aToken: string;
  bToken: string;
}

export interface AcceptResponse {
  acceptedTokens: string[];
}

export interface SessionResponse {
  acceptedTokens: string[];
  filteredActivities: RawActivity[] | null;
  chosenActivity: RawActivity | null;
}

export interface SessionEvent {
  acceptedTokens: string[];
}

export type ApiErrorResponse = {
  error: string;
};
