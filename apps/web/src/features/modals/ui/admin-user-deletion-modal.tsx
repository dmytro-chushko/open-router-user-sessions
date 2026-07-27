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
  Form,
} from "@repo/ui";
import { useTranslations } from "next-intl";

import { useAdminUserDeleteForm } from "@/features/admin/hooks/use-admin-user-delete-form";
import { AdminUserDeleteFormFields } from "@/features/admin/ui/user-detail/admin-user-delete-form-fields";
import { ADMIN_USER_DELETION_FORM_ID } from "@/features/modals/constants/admin-user-deletion-form-id";
import { useAdminUserDeletionModal } from "@/features/modals/hooks/use-admin-user-deletion-modal";

function AdminUserDeletionModalContent({
  userId,
  email,
  onClose,
}: {
  userId: string;
  email: string;
  onClose: () => void;
}) {
  const t = useTranslations("protected.admin.actions");
  const { form, handleSubmit, isPending } = useAdminUserDeleteForm({
    userId,
    email,
    onSuccess: onClose,
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{t("deleteConfirmDescription")}</p>
            <p className="font-medium text-foreground">{email}</p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Form {...form}>
        <form
          id={ADMIN_USER_DELETION_FORM_ID}
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <AdminUserDeleteFormFields form={form} email={email} />
        </form>
      </Form>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>
          {t("cancel")}
        </AlertDialogCancel>
        <Button
          form={ADMIN_USER_DELETION_FORM_ID}
          type="submit"
          variant="destructive"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? t("deletingUser") : t("deleteUser")}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export function AdminUserDeletionModal() {
  const { isOpen, payload, close } = useAdminUserDeletionModal();

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
        <AdminUserDeletionModalContent
          userId={payload.userId}
          email={payload.email}
          onClose={close}
        />
      ) : null}
    </AlertDialog>
  );
}
