import ComparisonSet from "../src/utils/comparison-set";
import { createFixtureData } from "./fixtures";

describe("ComparisonSet", () => {
  const { applicationData, tags } = createFixtureData();

  describe("fromSets", () => {
    it("creates boolean representation using global tag ordering", () => {
      const result = ComparisonSet.fromSets(
        applicationData.tags,
        new Set([tags.football])
      );

      expect(result.localTagSet).toEqual([
        true,
        false,
        false,
      ]);
    });

    it("handles empty local set", () => {
      const result = ComparisonSet.fromSets(
        applicationData.tags,
        new Set()
      );

      expect(result.localTagSet).toEqual([
        false,
        false,
        false,
      ]);
    });

    it("ignores tags outside the global set", () => {
      const unknownTag = {
        id: "unknown",
        description: "Unknown",
        iconId: "unknown",
        category: tags.football.category,
      };

      const result = ComparisonSet.fromSets(
        applicationData.tags,
        new Set([unknownTag])
      );

      expect(result.localTagSet).toEqual([
        false,
        false,
        false,
      ]);
    });
  });


  describe("intersection", () => {
    it("returns tags present in both sets", () => {
      const a = new ComparisonSet([
        true,
        true,
        false,
      ]);

      const b = new ComparisonSet([
        false,
        true,
        true,
      ]);

      expect(a.intersection(b).localTagSet)
        .toEqual([
          false,
          true,
          false,
        ]);
    });

    it("throws for incompatible sizes", () => {
      const a = new ComparisonSet([true]);
      const b = new ComparisonSet([true, false]);

      expect(() => a.intersection(b))
        .toThrow("ComparisonSets use incompatible global tag lists.");
    });
  });


  describe("isCoveringOther", () => {
    it("returns true when this set contains all tags from other", () => {
      const covering = new ComparisonSet([
        true,
        true,
        false,
      ]);

      const other = new ComparisonSet([
        true,
        false,
        false,
      ]);

      expect(covering.isCoveringOther(other))
        .toBe(true);
    });


    it("returns false when another set contains missing tags", () => {
      const covering = new ComparisonSet([
        true,
        false,
        false,
      ]);

      const other = new ComparisonSet([
        true,
        true,
        false,
      ]);

      expect(covering.isCoveringOther(other))
        .toBe(false);
    });
  });
});

