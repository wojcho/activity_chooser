import {
  Badge,
  Box,
  Card,
  Container,
  Group,
  Overlay,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { CheckIcon, ConfettiIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type Activity from "../model/activity";
import DynamicIcon from "./DynamicIcon";

type Props = {
  filteredActivities: Activity[] | null;
  chosenActivity: Activity | null;
};

const CARD_GAP = 16;

const CARD_ASPECT_RATIO = 1.65;
const CARD_MIN_HEIGHT = 220;
const CARD_MAX_HEIGHT = 320;

function getCardHeight(width: number) {
  return Math.min(
    CARD_MAX_HEIGHT,
    Math.max(
      CARD_MIN_HEIGHT,
      width / CARD_ASPECT_RATIO
    )
  );
}

function ActivityCard({
  activity,
  highlighted = false,
  compact = false,
}: {
  activity: Activity;
  highlighted?: boolean;
  compact?: boolean;
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

        height: "100%",
        minHeight: compact
          ? undefined
          : CARD_MIN_HEIGHT,

        aspectRatio: compact
          ? undefined
          : `${CARD_ASPECT_RATIO}`,

        borderColor: highlighted
          ? "var(--mantine-color-teal-4)"
          : undefined,

        borderWidth: highlighted ? 3 : 1,
      }}
    >
      <Overlay color="black" opacity={0.45} zIndex={0} />

      <Box
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(
              circle at center,
              transparent 45%,
              rgba(0,0,0,.25) 70%,
              rgba(0,0,0,.6) 100%
            )
          `,
        }}
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
            border:
              "2px solid var(--mantine-color-teal-4)",
            backgroundColor:
              "var(--mantine-color-teal-9)",
          }}
        >
          <Group gap="xs">
            <CheckIcon color="white" />
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
          {Array.from(activity.tags).map((tag) => (
            <Badge
              key={tag.id}
              variant="light"
              color="gray"
              leftSection={
                <DynamicIcon iconId={tag.iconId} />
              }
            >
              {tag.id}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}

function Roulette({
  activities,
  winner,
  onFinished,
}: {
  activities: Activity[];
  winner: Activity;
  onFinished: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [viewportWidth, setViewportWidth] =
    useState(0);

  const [translate, setTranslate] =
    useState(0);

  const cardHeight = getCardHeight(
    Math.min(900, viewportWidth)
  );

  const cardWidth = Math.min(
    360,
    cardHeight * 0.75
  );

  const sequence = useMemo(() => {
    const arr: Activity[] = [];

    for (let i = 0; i < 60; i++) {
      arr.push(
        activities[
          Math.floor(
            Math.random() * activities.length
          )
        ]
      );
    }

    arr.push(winner);

    return arr;
  }, [activities, winner]);

  useEffect(() => {
    if (!viewportRef.current) return;

    const observer = new ResizeObserver(
      ([entry]) => {
        setViewportWidth(
          entry.contentRect.width
        );
      }
    );

    observer.observe(viewportRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!viewportWidth || !cardWidth) return;

    const stop =
      (sequence.length - 1) *
        (cardWidth + CARD_GAP) -
      viewportWidth / 2 +
      cardWidth / 2;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTranslate(stop);
      });
    });
  }, [
    sequence,
    viewportWidth,
    cardWidth,
  ]);

  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <Box
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform:
            "translateX(-50%)",
          width: 4,
          height: cardHeight,
          background:
            "var(--mantine-color-teal-9)",
          zIndex: 100,
        }}
      />

      <Box
        ref={viewportRef}
        style={{
          overflow: "hidden",
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          height: cardHeight,
        }}
      >
        <Group
          wrap="nowrap"
          gap={CARD_GAP}
          onTransitionEnd={onFinished}
          style={{
            width: "max-content",
            transform: `translateX(-${translate}px)`,
            transition:
              translate === 0
                ? "none"
                : "transform 5s cubic-bezier(.12,.85,.2,1)",
          }}
        >
          {sequence.map(
            (activity, index) => (
              <Box
                key={index}
                w={cardWidth}
                h={cardHeight}
                style={{
                  flexShrink: 0,
                }}
              >
                <ActivityCard
                  activity={activity}
                  compact
                />
              </Box>
            )
          )}
        </Group>
      </Box>
    </Box>
  );
}

export default function SessionResults({
  filteredActivities,
  chosenActivity,
}: Props) {
  const [showRoulette, setShowRoulette] =
    useState(
      !!chosenActivity &&
        !!filteredActivities?.length
    );

  const [played, setPlayed] =
    useState(showRoulette);

  useEffect(() => {
    if (
      played ||
      !chosenActivity ||
      !filteredActivities?.length
    ) {
      return;
    }

    setPlayed(true);
    setShowRoulette(true);
  }, [
    played,
    chosenActivity,
    filteredActivities,
  ]);

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

              {showRoulette ? (
                <Roulette
                  activities={
                    filteredActivities ?? []
                  }
                  winner={chosenActivity}
                  onFinished={() =>
                    setShowRoulette(false)
                  }
                />
              ) : (
                <ActivityCard
                  activity={chosenActivity}
                  highlighted
                />
              )}
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
                {filteredActivities.map(
                  (activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                    />
                  )
                )}
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
