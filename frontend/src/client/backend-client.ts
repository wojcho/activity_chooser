import RawClient from "./raw-client";
import SessionsClient from "./session-client";

export default class BackendClient {
  readonly sessions: SessionsClient;
  readonly raw: RawClient;

  constructor(baseUrl: string) {
    this.sessions = new SessionsClient(baseUrl);
    this.raw = new RawClient(baseUrl);
  }
}

