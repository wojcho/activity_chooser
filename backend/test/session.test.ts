import { Session } from "../src/utils/session";
import { createFixtureData } from "./fixtures";

describe("Session", () => {
  const {
    applicationData,
    tags,
    activities,
  } = createFixtureData();


  describe("creation", () => {
    it("creates a new session", () => {
      const session = Session.fromApplicationData(
        applicationData,
        ["aaa", "bbb"]
      );

      expect(session.id).toHaveLength(16);

      expect(session.aToken).toBeDefined();
      expect(session.bToken).toBeDefined();

      expect(session.aComparisonSet).toBeNull();
      expect(session.bComparisonSet).toBeNull();

      expect(session.filteredActivities).toBeNull();
      expect(session.chosenActivity).toBeNull();
    });
  });


  describe("accept", () => {
    it("first user acceptance moves session to partially closed", () => {
      const session = Session.fromApplicationData(
        applicationData,
        ["aaa", "bbb"]
      );

      const result = session.accept(
        session.aToken,
        new Set([tags.football])
      );

      expect(result.aComparisonSet)
        .not
        .toBeNull();

      expect(result.bComparisonSet)
        .toBeNull();

      expect(result.filteredActivities)
        .toBeNull();
    });


    it("second user acceptance closes session", () => {
      const session = Session.fromApplicationData(
        applicationData,
        ["aaa", "bbb"]
      );

      const partiallyClosed = session.accept(
        session.aToken,
        new Set([tags.football, tags.outdoor])
      );

      const closed = partiallyClosed.accept(
        session.bToken,
        new Set([tags.outdoor])
      );


      expect(closed.aComparisonSet)
        .not
        .toBeNull();

      expect(closed.bComparisonSet)
        .not
        .toBeNull();


      expect(closed.filteredActivities)
        .toEqual(
          new Set([
            activities.walkAround,
          ])
        );


      expect(closed.chosenActivity)
        .toBe(activities.walkAround);
    });


    it("does not allow accepting when in a closed session", () => {
      const session = Session.fromApplicationData(
        applicationData,
        ["aaa"]
      );

      const closed = session
        .accept(session.aToken, new Set([tags.football]))
        .accept(session.bToken, new Set([tags.football]));


      expect(() =>
        closed.accept(
          session.aToken,
          new Set([tags.football])
        )
      ).toThrow(
        "In current session state, there cannot be acceptance"
      );
    });


    it("throws when second acceptance has invalid previous state", () => {
      const session = Session.fromApplicationData(
        applicationData,
        ["aaa"]
      );

      const partlyClosed = session.accept(
        session.aToken,
        new Set([tags.football])
      );

      const broken = Object.assign(
        Object.create(Object.getPrototypeOf(partlyClosed)),
        partlyClosed,
        {
          aComparisonSet: null,
          bComparisonSet: null,
        }
      );

      expect(() =>
        broken.accept(
          session.bToken,
          new Set([tags.football])
        )
      ).toThrow();
    });
  });


  describe("activity filtering", () => {
    it("keeps activities matching intersection of both users' selected tags", () => {
      const session = Session.fromApplicationData(
        applicationData,
        ["aaa"]
      );

      const result = session
        .accept(
          session.aToken,
          new Set([tags.football, tags.outdoor])
        )
        .accept(
          session.bToken,
          new Set([tags.outdoor])
        );


      expect(result.filteredActivities)
        .toEqual(
          new Set([
            activities.walkAround,
          ])
        );
    });


    it("returns no activities when users have incompatible tags", () => {
      const session = Session.fromApplicationData(
        applicationData,
        ["aaa"]
      );

      const result = session
        .accept(
          session.aToken,
          new Set([tags.football])
        )
        .accept(
          session.bToken,
          new Set([tags.cooking])
        );


      expect(result.filteredActivities)
        .toEqual(new Set());


      expect(result.chosenActivity)
        .toBeNull();
    });
  });
});

