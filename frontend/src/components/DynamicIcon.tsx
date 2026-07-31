import * as P from "@phosphor-icons/react";

export default function DynamicIcon({
  iconId,
}: {
  iconId: string;
}) {
  const Icon = P[iconId as keyof typeof P];

  if (!Icon || typeof Icon !== "function") {
    return null;
  }

  return <Icon />;
}
