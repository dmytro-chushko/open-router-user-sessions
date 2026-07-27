"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@repo/ui";

import { useAdminRevokeSessionsModal } from "@/features/modals/hooks/use-admin-revoke-sessions-modal";

export function AdminRevokeSessionsModal() {
  const { isOpen, payload, close, isPending, handleRevoke, t } =
    useAdminRevokeSessionsModal();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      {isOpen && payload ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("revokeSessionsConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("revokeSessionsConfirmDescription")}</p>
                <p className="font-medium text-foreground">{payload.email}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t("cancel")}
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              aria-busy={isPending}
              onClick={() => {
                void handleRevoke();
              }}
            >
              {isPending ? t("revokingSessions") : t("revokeSessions")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : null}
    </AlertDialog>
  );
}
