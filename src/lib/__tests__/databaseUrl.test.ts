import { describe, expect, it } from "vitest";
import { normalizeDatabaseUrl } from "../databaseUrl";

describe("normalizeDatabaseUrl", () => {
  it.each(["prefer", "require", "verify-ca"])(
    "upgrades the legacy %s SSL mode to verify-full",
    (sslMode) => {
      const result = new URL(
        normalizeDatabaseUrl(
          `postgresql://user:password@db.example.com/school?sslmode=${sslMode}&channel_binding=require`
        )
      );

      expect(result.searchParams.get("sslmode")).toBe("verify-full");
      expect(result.searchParams.get("channel_binding")).toBe("require");
    }
  );

  it("preserves other SSL modes", () => {
    const result = new URL(
      normalizeDatabaseUrl("postgresql://user:password@db.example.com/school?sslmode=verify-full")
    );

    expect(result.searchParams.get("sslmode")).toBe("verify-full");
  });
});
