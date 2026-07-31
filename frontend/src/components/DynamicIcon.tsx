import type { IconProps } from "@phosphor-icons/react";
import * as P from "@phosphor-icons/react";

export default function DynamicIcon({
  iconId,
}: {
  iconId: string;
}) {
  const Icon = P[iconId as keyof typeof P] as React.ComponentType<IconProps>;

  if (!Icon) {
    return null;
  }

  return <Icon />;
}
