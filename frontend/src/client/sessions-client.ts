import ApiClient from "./api-client";
import {
  AcceptResponse,
  CreateSessionResponse,
  SessionEvent,
  SessionResponse,
} from "./models";

export default class SessionsClient extends ApiClient {

  createSession() {
    return this.post<CreateSessionResponse>(
      "/sessions",
    );
  }

  accept(
    sessionId: string,
    token: string,
    tagIds: string[],
  ) {
    return this.post<AcceptResponse>(
      `/sessions/${sessionId}/accept`,
      {
        token,
        tagIds,
      },
    );
  }

  getSession(sessionId: string) {
    return this.get<SessionResponse>(
      `/sessions/${sessionId}`,
    );
  }

  subscribe(
    sessionId: string,
    callback: (event: SessionEvent) => void,
  ) {
    const source = new EventSource(
      `${this["baseUrl"]}/sessions/${sessionId}/events`,
    );

    source.onmessage = (event) => {
      callback(
        JSON.parse(event.data),
      );
    };

    return () => source.close();
  }
}

