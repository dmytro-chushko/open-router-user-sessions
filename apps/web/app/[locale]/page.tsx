import { HelloDemo } from "@/views/hello-demo";
import { HomeAuthCta } from "@/views/home-auth-cta";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <HomeAuthCta />
      <HelloDemo />
    </div>
  );
}
