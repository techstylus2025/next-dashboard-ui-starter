import { describe, expect, it } from "vitest";
import {
  computeSubjectPercentage,
  computeJhsOverallGrade,
  lookupGradeFromScale,
} from "./gradingUtils";

describe("computeJhsOverallGrade", () => {
  it("adds all core grades and the two best elective grades", () => {
    expect(
      computeJhsOverallGrade([
        { grade: "2", isCore: true },
        { grade: "1", isCore: true },
        { grade: "5", isCore: false },
        { grade: "3", isCore: false },
        { grade: "1", isCore: false },
      ])
    ).toBe("7");
  });

  it("ignores non-JHS grades and missing grades", () => {
    expect(
      computeJhsOverallGrade([
        { grade: "A", isCore: true },
        { grade: null, isCore: false },
        { grade: "9", isCore: false },
      ])
    ).toBe("9");
  });

  it("returns null when there are no numeric grades", () => {
    expect(computeJhsOverallGrade([{ grade: "A", isCore: true }])).toBeNull();
  });
});

describe("lookupGradeFromScale", () => {
  it("finds the configured grade and remark for a percentage", () => {
    expect(
      lookupGradeFromScale("JHS", 85, [
        {
          level: "JHS",
          minScore: 80,
          maxScore: 100,
          grade: "1",
          remark: "Excellent",
        },
      ])
    ).toEqual({ grade: "1", remark: "Excellent" });
  });

  describe("computeSubjectPercentage", () => {
    it("uses the combined class and exam maximum for a 100-point subject total", () => {
      expect(computeSubjectPercentage(30, 70, 50, 30, 70)).toBe(100);
      expect(computeSubjectPercentage(15, 35, 50, 30, 70)).toBe(50);
    });
  });
});
