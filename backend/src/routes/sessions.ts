import { Router, Request, Response } from "express";
import { applicationData, wordList } from "../utils/import-data";
import SessionsHolder from "../utils/sessions-holder";
import Tag from "../model/tag";

const router = Router();

const sessionsHolder = new SessionsHolder(applicationData, wordList);

// POST /sessions
// create session
// output sessionId, aToken, bToken
// {
//   sessionId: string;
//   aToken: string;
//   bToken: string;
// }
// |
// {
//   error: string
// }
router.post("/sessions", (_req: Request, res: Response) => {
  try {
    const sessionId = sessionsHolder.createSession();
    const session = sessionsHolder.getSession(sessionId);

    if (!session) {
      res.status(500).json({ error: "Failed to create session" });
      return;
    }

    res.status(201).json({
      sessionId: session.id,
      aToken: session.aToken,
      bToken: session.bToken,
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// POST /sessions/:sessionId/accept
// accept in session, taking sessionId: string, token: string, tagIds: string[], output new SessionState
// {
//   state: SessionState
// }
// |
// {
//   error: string
// }
router.post(
  "/sessions/:sessionId/accept",
  (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      if (Array.isArray(sessionId) || !(typeof sessionId === "string")) {
        res.status(400).json({
          error: "Only one session identifier should be provided",
        });
        return;
      }
      const { token, tagIds } = req.body as {
        token: string;
        tagIds: string[];
      };

      if (!token || !Array.isArray(tagIds)) {
        res.status(400).json({
          error: "Expected token and tagIds[]",
        });
        return;
      }

      const tags = new Set<Tag>();

      for (const tagId of tagIds) {
        const tag = [...applicationData.tags]
          .find(t => t.id === tagId);

        if (!tag) {
          res.status(400).json({
            error: `Unknown tag id: ${tagId}`,
          });
          return;
        }

        tags.add(tag);
      }

      sessionsHolder.acceptInSession(
        sessionId,
        token,
        tags,
      );

      const session = sessionsHolder.getSession(sessionId);

      if (!session) {
        res.status(404).json({
          error: "Session not found",
        });
        return;
      }

      res.json({
        state: session.state,
      });

    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
);

// GET /sessions/:sessionId
// TODO get { state: SessionState, filteredActivities: Actvity[] | null, chosenActivity: Actvity | null }, taking sessionId: string
// {
//   state: SessionState;
//   filteredActivities: Activity[];
//   chosenActivity: Activity;
// }
// |
// {
//   error: string
// }
router.get(
  "/sessions/:sessionId",
  (req: Request, res: Response) => {
    const { sessionId } = req.params;
    if (Array.isArray(sessionId) || !(typeof sessionId === "string")) {
      res.status(400).json({
        error: "Only one session identifier should be provided",
      });
      return;
    }
    const session = sessionsHolder.getSession(sessionId);

    if (!session) {
      res.status(404).json({
        error: "Session not found",
      });
      return;
    }

    res.json({
      state: session.state,
      filteredActivities: session.filteredActivities
        ? [...session.filteredActivities]
        : null,
      chosenActivity: session.chosenActivity,
    });
  }
);

export default router;
