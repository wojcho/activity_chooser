import {
  Badge,
  Card,
  Container,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  Overlay,
  Box,
} from "@mantine/core";
import { CheckIcon, ConfettiIcon } from "@phosphor-icons/react";
import type Actvity from "../model/activity";
import DynamicIcon from "./DynamicIcon";

type Props = {
  filteredActivities: Actvity[] | null;
  chosenActivity: Actvity | null;
};

function ActivityCard({
  activity,
  highlighted = false,
}: {
  activity: Actvity;
  highlighted?: boolean;
}) {
  return (
    <Card
      radius="md"
      shadow="sm"
      withBorder
      p="lg"
      style={{
        backgroundImage: `url(${activity.backgroundHref})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: 220,
        borderColor: highlighted
          ? "var(--mantine-color-teal-4)"
          : undefined,
        borderWidth: highlighted ? 3 : 1,
      }}
    >
      <Overlay
        color="black"
        opacity={0.55}
        zIndex={0}
      />

      {highlighted && (
        <Box
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
            padding: "6px 14px",
            borderRadius: 999,
            border: "2px solid var(--mantine-color-teal-4)",
            backgroundColor: "rgba(0, 150, 136, 0.25)",
          }}
        >
          <Group gap="xs">
            <CheckIcon color="white"/>
            <Text size="sm" fw={700} c="white">
              Selected activity
            </Text>
          </Group>
        </Box>
      )}

      <Stack
        gap="md"
        style={{
          position: "relative",
          zIndex: 1,
          color: "white",
        }}
      >
        <Stack gap={4}>
          <Title order={3} c="white">
            {activity.id}
          </Title>

          <Text c="white">
            {activity.description}
          </Text>
        </Stack>

        <Group gap="xs">
          {[...activity.tags].map(tag => (
            <Badge
              key={tag.id}
              variant="light"
              color="gray"
              leftSection={<DynamicIcon iconId={tag.iconId} />}
            >
              {tag.id}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}

export default function SessionResults({
  filteredActivities,
  chosenActivity,
}: Props) {
  return (
    <Container size="md" py="xl">
      <Stack>
        {chosenActivity && (
          <Paper
            p="xl"
            shadow="sm"
            radius="md"
          >
            <Stack>
              <Title order={2}>
                <Group gap="xs">
                  <ConfettiIcon />
                  Chosen activity
                </Group>
              </Title>

              <ActivityCard
                activity={chosenActivity}
                highlighted
              />
            </Stack>
          </Paper>
        )}

        <Paper
          p="xl"
          shadow="sm"
          radius="md"
        >
          <Stack>
            <Title order={2}>
              Matching activities
            </Title>

            {filteredActivities?.length ? (
              <Stack gap="md">
                {filteredActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                  />
                ))}
              </Stack>
            ) : (
              <Text c="dimmed">
                No matching activities were found.
              </Text>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
