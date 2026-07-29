import { describe, expect, it } from "vitest";

import {
  parseAdminAuditLogsListParams,
  patchAdminAuditLogsListParams,
  serializeAdminAuditLogsListParams,
} from "./admin-audit-logs-list-params";

import { DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY } from "@/entities/admin/model/admin-audit-logs-list-query";

describe("parseAdminAuditLogsListParams", () => {
  it("falls back to defaults for an empty query string", () => {
    const actual = parseAdminAuditLogsListParams(new URLSearchParams());

    expect(actual).toEqual({
      page: 1,
      pageSize: 20,
      action: undefined,
      from: undefined,
      to: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("reads pagination, action, dates and sorting", () => {
    const actual = parseAdminAuditLogsListParams(
      new URLSearchParams({
        page: "3",
        pageSize: "50",
        action: "LOGIN_FAILED",
        from: "2026-01-01T00:00:00.000Z",
        to: "2026-01-31T23:59:59.999Z",
        sortBy: "action",
        sortOrder: "asc",
      }),
    );

    expect(actual).toEqual({
      page: 3,
      pageSize: 50,
      action: "LOGIN_FAILED",
      from: new Date("2026-01-01T00:00:00.000Z"),
      to: new Date("2026-01-31T23:59:59.999Z"),
      sortBy: "action",
      sortOrder: "asc",
    });
  });

  it("ignores invalid values instead of throwing", () => {
    const actual = parseAdminAuditLogsListParams(
      new URLSearchParams({
        page: "0",
        action: "NOT_AN_ACTION",
        from: "not-a-date",
        sortBy: "ipAddress",
        sortOrder: "sideways",
      }),
    );

    expect(actual).toEqual(DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY);
  });

  it("clamps pageSize to the maximum allowed value", () => {
    const actual = parseAdminAuditLogsListParams(
      new URLSearchParams({ pageSize: "500" }),
    );

    expect(actual.pageSize).toBe(100);
  });
});

describe("serializeAdminAuditLogsListParams", () => {
  it("omits values that match defaults", () => {
    const actual = serializeAdminAuditLogsListParams(
      DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY,
    );

    expect(actual.toString()).toBe("");
  });

  it("writes non-default filters and sorting as ISO dates", () => {
    const actual = serializeAdminAuditLogsListParams({
      page: 2,
      pageSize: 50,
      action: "USER_DELETED",
      from: new Date("2026-01-01T00:00:00.000Z"),
      to: new Date("2026-01-31T23:59:59.999Z"),
      sortBy: "action",
      sortOrder: "asc",
    });

    expect(Object.fromEntries(actual)).toEqual({
      page: "2",
      pageSize: "50",
      action: "USER_DELETED",
      from: "2026-01-01T00:00:00.000Z",
      to: "2026-01-31T23:59:59.999Z",
      sortBy: "action",
      sortOrder: "asc",
    });
  });

  it("round-trips through parse", () => {
    const query = {
      page: 4,
      pageSize: 20,
      action: "LOGOUT",
      from: new Date("2026-02-01T00:00:00.000Z"),
      to: undefined,
      sortBy: "createdAt",
      sortOrder: "asc",
    } as const;

    expect(
      parseAdminAuditLogsListParams(
        serializeAdminAuditLogsListParams({ ...query }),
      ),
    ).toEqual(query);
  });
});

describe("patchAdminAuditLogsListParams", () => {
  const current = {
    ...DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY,
    page: 5,
  };

  it("resets page when a filter changes", () => {
    const actual = patchAdminAuditLogsListParams(current, {
      action: "LOGIN_SUCCESS",
    });

    expect(actual).toEqual({
      ...DEFAULT_ADMIN_AUDIT_LOGS_LIST_QUERY,
      page: 1,
      action: "LOGIN_SUCCESS",
    });
  });

  it("resets page when sorting changes", () => {
    const actual = patchAdminAuditLogsListParams(current, {
      sortBy: "action",
      sortOrder: "asc",
    });

    expect(actual.page).toBe(1);
    expect(actual.sortBy).toBe("action");
    expect(actual.sortOrder).toBe("asc");
  });

  it("keeps an explicit page from the patch", () => {
    const actual = patchAdminAuditLogsListParams(current, {
      action: "LOGOUT",
      page: 3,
    });

    expect(actual.page).toBe(3);
  });

  it("keeps the current page when only page changes", () => {
    const actual = patchAdminAuditLogsListParams(current, { page: 7 });

    expect(actual.page).toBe(7);
    expect(actual.action).toBeUndefined();
  });
});
