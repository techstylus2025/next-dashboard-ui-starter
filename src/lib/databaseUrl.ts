const LEGACY_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

export function normalizeDatabaseUrl(connectionString: string): string {
  const url = new URL(connectionString);
  const sslMode = url.searchParams.get("sslmode")?.toLowerCase();

  if (sslMode && LEGACY_SSL_MODES.has(sslMode)) {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}
