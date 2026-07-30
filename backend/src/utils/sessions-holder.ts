import { Session } from "./session";
import { ApplicationData } from "../model/application-data";
import Tag from "../model/tag";

class SessionsHolder {
  readonly applicationData: ApplicationData;
  readonly wordList: string[];

  sessions: Map<string, Session>;

  constructor(applicationData: ApplicationData, wordList: string[]) {
    this.applicationData = applicationData;
    this.wordList = wordList;
    this.sessions = new Map<string, Session>();
  }

  createSession(): string {
    const newSession = Session.fromApplicationData(this.applicationData, this.wordList);
    this.sessions.set(newSession.id, newSession);
    return newSession.id;
  }

  acceptInSession(sessionId: string, token: string, tags: Set<Tag>): void {
    const oldSession = this.sessions.get(sessionId);
    if (!oldSession) {
      throw new Error("Session ID unrecognized");
    }
    const newSession = oldSession.accept(token, tags);
    this.sessions.set(sessionId, newSession);
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

}

export default SessionsHolder;
