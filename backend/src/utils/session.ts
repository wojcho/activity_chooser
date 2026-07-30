import { randomBytes } from "crypto";

import Actvity from "../model/activity";
import Tag from "../model/tag";
import ComparisonSet from "../utils/comparison-set";
import { ApplicationData } from "../utils/import-data";

enum SessionState {
  /** State machine
  * At beginning state is New
  * First user confirms chosen tags with their token and state becomes PartlyClosed
  * Another user confirms chosen tags with their token and state becomes Closed
  */
  New,
  PartlyClosed,
  Closed,
}

function generateRememberableId(wordsAmount: number, wordsList: string[]): string {
  const wordsListLen = wordsList.length;
  const out: string[] = new Array(wordsAmount);
  const bytes = randomBytes(length);
  for (let i = 0; i < length; ++i) {
    out[i] = wordsList[bytes[i] % wordsListLen];
  }
  return out.join("-");
}

function generateInnerId(length: number): string {
  const baseChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charsLen = baseChars.length;
  const out: string[] = new Array(length);
  const bytes = randomBytes(length);
  for (let i = 0; i < length; ++i) {
    out[i] = baseChars[bytes[i] % charsLen];
  }
  return out.join("");
}

function randomFromSet<T>(set: Set<T>): T {
  if (set.size === 0) {
    throw new Error("Cannot draw random from empty set");
  };

  const target = Math.floor(Math.random() * set.size);
  let i = 0;
  for (const value of set) {
    if (i === target) {
      return value;
    }
    ++i;
  }
  throw new Error("Index over set size, this should never happen");
}

class Session {
  readonly id: string;

  readonly applicationData: ApplicationData;

  readonly state: SessionState;

  readonly aToken: string;
  readonly bToken: string;

  readonly aComparisonSet: ComparisonSet | null;
  readonly bComparisonSet: ComparisonSet | null;

  readonly filteredActivities: Set<Actvity> | null;
  readonly chosenActivity: Actvity | null;

  constructor(
    id: string,
    applicationData: ApplicationData,
    state: SessionState,
    aToken: string,
    bToken: string,
    aComparisonSet: ComparisonSet | null,
    bComparisonSet: ComparisonSet | null,
    filteredActivities: Set<Actvity> | null,
    chosenActivity: Actvity | null,
  ) {
    this.id = id;
    this.applicationData = applicationData;
    this.state = state;
    this.aToken = aToken;
    this.bToken = bToken;
    this.aComparisonSet = aComparisonSet;
    this.bComparisonSet = bComparisonSet;
    this.filteredActivities = filteredActivities;
    this.chosenActivity = chosenActivity;
  }

  static fromApplicationData(applicationData: ApplicationData, wordList: string[]) {
    return new Session(
      generateInnerId(16),
      applicationData,
      SessionState.New,
      generateRememberableId(Math.floor(Math.random() * 4), wordList),
      generateRememberableId(Math.floor(Math.random() * 4), wordList),
      null,
      null,
      null,
      null,
    );
  }

  accept(token: string, tags: Set<Tag>): Session {
    if (this.state === SessionState.New) {
      const comparison = ComparisonSet.fromSets(this.applicationData.tags, tags);
      let aComparisonSet;
      let bComparisonSet;
      if (this.aToken === token) {
        aComparisonSet = comparison;
        bComparisonSet = null;
      } else {
        aComparisonSet = null;
        bComparisonSet = comparison;
      }
      return new Session(
        this.id,
        this.applicationData,
        SessionState.PartlyClosed,
        this.aToken,
        this.bToken,
        aComparisonSet,
        bComparisonSet,
        null,
        null,
      );
    } else if (this.state == SessionState.PartlyClosed) {
      const comparison = ComparisonSet.fromSets(this.applicationData.tags, tags);
      let aComparisonSet: ComparisonSet;
      let bComparisonSet: ComparisonSet;
      if (this.aToken === token) {
        if (!this.aComparisonSet) {
          throw new Error("Wrong state, earlier comparison set should be provided in PartlyClosed state");
        }
        aComparisonSet = this.aComparisonSet;
        bComparisonSet = comparison;
      } else {
        if (!this.bComparisonSet) {
          throw new Error("Wrong state, earlier comparison set should be provided in PartlyClosed state");
        }
        aComparisonSet = comparison;
        bComparisonSet = this.bComparisonSet;
      }
      const filteredActivities = Session.prepareFilteredActivities(this.applicationData, aComparisonSet, bComparisonSet);
      const chosenActivity: Actvity = randomFromSet(filteredActivities);
      return new Session(
        this.id,
        this.applicationData,
        SessionState.Closed,
        this.aToken,
        this.bToken,
        aComparisonSet,
        bComparisonSet,
        filteredActivities,
        chosenActivity,
      );
    } else {
      throw new Error("In current session state, there cannot be acceptance");
    }
  }

  private static prepareFilteredActivities(
      applicationData: ApplicationData,
      aComparisonSet: ComparisonSet,
      bComparisonSet: ComparisonSet,
    ): Set<Actvity> {
    // Filter though activities, leaving only those which have tags from allowed tags, obtained by intersection of allowed tags of both users
    const intersection: ComparisonSet = aComparisonSet.intersection(bComparisonSet);
    const allowedActivities: Set<Actvity> = new Set();
    for (let activity of applicationData.activities) {
      const currentComparisonSet = ComparisonSet.fromSets(applicationData.tags, activity.tags);
      if (intersection.isCoveringOther(currentComparisonSet)) {
        allowedActivities.add(activity);
      }
    }
    return allowedActivities;
  }

}

export default Session;
