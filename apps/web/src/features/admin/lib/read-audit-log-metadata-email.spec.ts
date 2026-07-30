import { describe, expect, it } from "vitest";

import {
  readAuditLogMetadataEmail,
  readAuditLogTargetMetadataEmail,
} from "@/features/admin/lib/read-audit-log-metadata-email";

describe("readAuditLogMetadataEmail", () => {
  it("returns a trimmed email from metadata", () => {
    expect(readAuditLogMetadataEmail({ email: "  user@example.com  " })).toBe(
      "user@example.com",
    );
  });

  it("returns null when email is missing", () => {
    expect(readAuditLogMetadataEmail({ reason: "invalid_credentials" })).toBe(
      null,
    );
  });
});

describe("readAuditLogTargetMetadataEmail", () => {
  it("allows metadata email for delete actions only", () => {
    expect(
      readAuditLogTargetMetadataEmail({
        action: "ACCOUNT_SELF_DELETED",
        metadata: { email: "gone@example.com" },
      }),
    ).toBe("gone@example.com");

    expect(
      readAuditLogTargetMetadataEmail({
        action: "LOGIN_FAILED",
        metadata: { email: "user@example.com" },
      }),
    ).toBe(null);
  });
});
