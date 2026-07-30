import type { AuditAction, AuditLogItem } from "@repo/api-contracts";

const TARGET_METADATA_EMAIL_ACTIONS = new Set<AuditAction>([
  "USER_DELETED",
  "ACCOUNT_SELF_DELETED",
]);

/**
 * Reads `metadata.email` when actor/target relations are null
 * (anonymous login failures, deleted users with null FKs).
 */
export function readAuditLogMetadataEmail(
  metadata: AuditLogItem["metadata"],
): string | null {
  if (metadata === null || typeof metadata !== "object") {
    return null;
  }

  const email = metadata.email;

  if (typeof email !== "string") {
    return null;
  }

  const trimmed = email.trim();

  return trimmed.length > 0 ? trimmed : null;
}

/** Target column may reuse metadata.email only for delete-style events. */
export function readAuditLogTargetMetadataEmail(
  item: Pick<AuditLogItem, "action" | "metadata">,
): string | null {
  if (!TARGET_METADATA_EMAIL_ACTIONS.has(item.action)) {
    return null;
  }

  return readAuditLogMetadataEmail(item.metadata);
}
