export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;

  if (error && typeof error === "object") {
    const record = error as { message?: unknown; error?: unknown };

    if (typeof record.message === "string" && record.message) {
      return record.message;
    }

    if (typeof record.error === "string" && record.error) {
      return record.error;
    }
  }

  return fallback;
}
