"use client";

import type { AdminUserDetail } from "@repo/api-contracts";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useAdminUpdateRoleMutation } from "@/entities/admin/api/use-admin-update-role-mutation";
import { mapAdminUsersApiError } from "@/features/admin/lib/map-admin-users-api-error";
import { ApiRequestError } from "@/shared/api/api-request-error";

type AdminUserRoleFormProps = {
  user: AdminUserDetail;
  isSelf: boolean;
};

export function AdminUserRoleForm({ user, isSelf }: AdminUserRoleFormProps) {
  const t = useTranslations("protected.admin.actions");
  const tUsers = useTranslations("protected.admin.users");
  const tErrors = useTranslations("protected.admin.errors");
  const updateRoleMutation = useAdminUpdateRoleMutation();
  const [selectedRole, setSelectedRole] = useState<AdminUserDetail["role"]>(
    user.role,
  );
  const hasChanges = selectedRole !== user.role;
  const isPending = updateRoleMutation.isPending;

  useEffect(() => {
    setSelectedRole(user.role);
  }, [user.role]);

  if (isSelf) {
    return (
      <p className="text-sm text-muted-foreground">
        {tErrors("cannotChangeOwnRole")}
      </p>
    );
  }

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    try {
      await updateRoleMutation.mutateAsync({
        userId: user.id,
        role: selectedRole,
      });
      toast.success(t("roleUpdateSuccess"));
    } catch (error) {
      const apiMessage =
        error instanceof ApiRequestError ? error.message : undefined;
      const message =
        apiMessage !== undefined
          ? mapAdminUsersApiError(apiMessage, tErrors)
          : error instanceof Error
            ? error.message
            : tErrors("generic");
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
      <div className="space-y-2">
        <label htmlFor="admin-user-role" className="text-sm font-medium">
          {t("changeRole")}
        </label>
        <Select
          value={selectedRole}
          onValueChange={(value) => {
            setSelectedRole(value as AdminUserDetail["role"]);
          }}
          disabled={isPending}
        >
          <SelectTrigger
            id="admin-user-role"
            aria-label={t("changeRole")}
            className="w-full sm:w-[11rem]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">{tUsers("roleUser")}</SelectItem>
            <SelectItem value="ADMIN">{tUsers("roleAdmin")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        className="w-full sm:w-auto"
        disabled={!hasChanges || isPending}
        aria-busy={isPending}
        onClick={() => {
          void handleSave();
        }}
      >
        {isPending ? t("savingRole") : t("saveRole")}
      </Button>
    </div>
  );
}
