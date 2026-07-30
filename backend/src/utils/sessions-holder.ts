import { Session } from "./session";
import { ApplicationData } from "../model/application-data";
import Tag from "../model/tag";

type SessionListener = (session: Session) => void;

class SessionsHolder {
  readonly applicationData: ApplicationData;
  readonly wordList: string[];

  sessions: Map<string, Session>;
  listeners: Map<string, Set<SessionListener>>;

  constructor(applicationData: ApplicationData, wordList: string[]) {
    this.applicationData = applicationData;
    this.wordList = wordList;
    this.sessions = new Map();
    this.listeners = new Map();
  }

  createSession(): string {
    const newSession = Session.fromApplicationData(
      this.applicationData,
      this.wordList,
    );

    this.sessions.set(newSession.id, newSession);
    return newSession.id;
  }

  acceptInSession(
    sessionId: string,
    token: string,
    tags: Set<Tag>,
  ): void {
    const oldSession = this.sessions.get(sessionId);

    if (!oldSession) {
      throw new Error("Session ID unrecognized");
    }

    const newSession = oldSession.accept(token, tags);

    this.sessions.set(sessionId, newSession);

    const listeners = this.listeners.get(sessionId);

    if (listeners) {
      for (const listener of listeners) {
        listener(newSession);
      }
    }
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  subscribe(
    sessionId: string,
    listener: SessionListener,
  ): () => void {
    let listeners = this.listeners.get(sessionId);

    if (!listeners) {
      listeners = new Set();
      this.listeners.set(sessionId, listeners);
    }

    listeners.add(listener);

    return () => {
      listeners!.delete(listener);

      if (listeners!.size === 0) {
        this.listeners.delete(sessionId);
      }
    };
  }

}

export default SessionsHolder;
