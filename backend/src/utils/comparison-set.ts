import Tag from "../model/tag";

class ComparisonSet {
  readonly localTagSet: boolean[];

  constructor(localTagSet: boolean[]) {
    this.localTagSet = localTagSet;
  }

  static fromSets(globalTags: Set<Tag>, localTags: Set<Tag>): ComparisonSet {
    const localIds = new Set([...localTags].map(t => t.id));
    const localTagSet = [...globalTags].map(tag => localIds.has(tag.id));
    return new ComparisonSet(localTagSet);
  }

  throwIfLengthIncompatible(other: ComparisonSet): void {
    if (this.localTagSet.length !== other.localTagSet.length) {
      throw new Error("ComparisonSets use incompatible global tag lists.");
    }
  }

  intersection(other: ComparisonSet): ComparisonSet {
    this.throwIfLengthIncompatible(other);
    return new ComparisonSet(
      this.localTagSet.map((present, i) => present && other.localTagSet[i])
    );
  }

  isCoveringOther(other: ComparisonSet): boolean {
    this.throwIfLengthIncompatible(other);
    return this.localTagSet.every((present: boolean, i: number): boolean => present || !other.localTagSet[i]);
  }
}

export default ComparisonSet;
