import http from "http";
import { EventSource } from "eventsource";
import request from "supertest";
import app from "../src/app";

describe("SSE", () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(done => {
    server = app.listen(0, () => {
      const { port } = server.address() as any;
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterAll(() =>
    new Promise<void>((resolve, reject) => {
      server.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
  );

  it("notifies subscribers", async () => {
    const create = await request(baseUrl)
      .post("/sessions");

    const session = create.body;

    const notification = new Promise<any>(resolve => {
      const es = new EventSource(
        `${baseUrl}/sessions/${session.sessionId}/events`
      );

      es.onmessage = event => {
        es.close();
        resolve(JSON.parse(event.data));
      };
    });

    await request(baseUrl)
      .post(`/sessions/${session.sessionId}/accept`)
      .send({
        token: session.aToken,
        tagIds: ["football"],
      });

    await expect(notification).resolves.toEqual({
      acceptedTokens: [session.aToken],
    });
  });
});
