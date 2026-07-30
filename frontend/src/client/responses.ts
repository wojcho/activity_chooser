import type Activity from "../model/activity";
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
  filteredActivities: Activity[] | null;
  chosenActivity: Activity | null;
}

export interface SessionEvent {
  state: SessionState;
}

export type ApiErrorResponse = {
  error: string;
};
