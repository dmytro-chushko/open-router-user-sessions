import { ProfileView } from "@/features/profile/ui/profile-view";
import { verifySession } from "@/shared/auth/verify-session";

export default async function ProfilePage() {
  const user = await verifySession();

  return <ProfileView user={user} />;
}
