import request from "supertest";
import app from "../src/app";

describe("Sessions API", () => {
  describe("POST /sessions", () => {
    it("creates a new session", async () => {
      const response = await request(app)
        .post("/sessions")
        .send();

      expect(response.status).toBe(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          sessionId: expect.any(String),
          aToken: expect.any(String),
          bToken: expect.any(String),
        }),
      );

      expect(response.body.aToken).not.toEqual(response.body.bToken);
    });
  });

  describe("POST /sessions/:sessionId/accept", () => {
    async function createSession() {
      const response = await request(app)
        .post("/sessions");

      expect(response.status).toBe(201);

      return response.body as {
        sessionId: string;
        aToken: string;
        bToken: string;
      };
    }

    it("accepts first user and moves session to contain accepted token", async () => {
      const session = await createSession();

      const response = await request(app)
        .post(`/sessions/${session.sessionId}/accept`)
        .send({
          token: session.aToken,
          tagIds: ["football"],
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        acceptedTokens: [session.aToken],
      });
    });

    it("accepts second user and closes session", async () => {
      const session = await createSession();

      await request(app)
        .post(`/sessions/${session.sessionId}/accept`)
        .send({
          token: session.aToken,
          tagIds: ["football"],
        });

      const response = await request(app)
        .post(`/sessions/${session.sessionId}/accept`)
        .send({
          token: session.bToken,
          tagIds: ["football", "outdoor"],
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        acceptedTokens: [session.aToken, session.bToken],
      });
    });

    it("rejects unknown token", async () => {
      const session = await createSession();

      const response = await request(app)
        .post(`/sessions/${session.sessionId}/accept`)
        .send({
          token: "wrong-token",
          tagIds: ["football"],
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        error: "Unrecognized token",
      });
    });

    it("rejects unknown tag id", async () => {
      const session = await createSession();

      const response = await request(app)
        .post(`/sessions/${session.sessionId}/accept`)
        .send({
          token: session.aToken,
          tagIds: ["does-not-exist"],
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        error: "Unknown tag id: does-not-exist",
      });
    });

    it("rejects missing body fields", async () => {
      const session = await createSession();

      const response = await request(app)
        .post(`/sessions/${session.sessionId}/accept`)
        .send({
          token: session.aToken,
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        error: "Expected token and tagIds[]",
      });
    });
  });

  describe("GET /sessions/:sessionId", () => {
    it("returns newly created session", async () => {
      const createResponse = await request(app)
        .post("/sessions");

      const { sessionId } = createResponse.body;

      const response = await request(app)
        .get(`/sessions/${sessionId}`);

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        acceptedTokens: [],
        filteredActivities: null,
        chosenActivity: null,
      });
    });

    it("returns 404 for unknown session", async () => {
      const response = await request(app)
        .get("/sessions/not-found");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        error: "Session not found",
      });
    });

    it("returns chosen activity after both users accept", async () => {
      const createResponse = await request(app)
        .post("/sessions");

      const session = createResponse.body;

      await request(app)
        .post(`/sessions/${session.sessionId}/accept`)
        .send({
          token: session.aToken,
          tagIds: ["football", "outdoor"],
        });

      await request(app)
        .post(`/sessions/${session.sessionId}/accept`)
        .send({
          token: session.bToken,
          tagIds: ["football", "outdoor"],
        });

      const response = await request(app)
        .get(`/sessions/${session.sessionId}`);

      expect(response.status).toBe(200);

      expect(response.body.acceptedTokens).toStrictEqual([session.aToken, session.bToken]);
      expect(response.body.filteredActivities).toBeDefined();

      expect(response.body.chosenActivity).toEqual(
        expect.objectContaining({
          id: "play-football",
          description: "Play football with friends",
        }),
      );
    });
  });
});
