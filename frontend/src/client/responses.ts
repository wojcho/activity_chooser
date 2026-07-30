import type { RawActivity } from "../model/application-data";
import { SessionState } from "../model/session-state";

export interface CreateSessionResponse {
  sessionId: string;
  aToken: string;
  bToken: string;
}

export interface AcceptResponse {
  state: SessionState;
}

export interface SessionResponse {
  state: SessionState;
  filteredActivities: RawActivity[] | null;
  chosenActivity: RawActivity | null;
}

export interface SessionEvent {
  state: SessionState;
}

export type ApiErrorResponse = {
  error: string;
};
