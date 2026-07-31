import {
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { CheckIcon } from "@phosphor-icons/react";
import type { ApplicationData } from "../model/application-data";
import DynamicIcon from "./DynamicIcon";

type Props = {
  applicationData: ApplicationData;
  selectedTags: Set<string>;
  onToggleTag(tagId: string): void;
  onAccept(): void;
  isSubmitting: boolean;
};

export default function TagSelection({
  applicationData,
  selectedTags,
  onToggleTag,
  onAccept,
  isSubmitting,
}: Props) {
  const categories = [...applicationData.tagCategories];
  const tags = [...applicationData.tags];

  return (
    <Container size="md" py="xl">
      <Stack>
        <Paper shadow="sm" radius="md" p="xl">
          <Stack>
            <Title order={1}>Choose your preferences</Title>

            <Text c="dimmed">
              Select every tag that is acceptable for you. Only activities
              matching both participants' selections will be considered.
            </Text>
          </Stack>
        </Paper>

        {categories.map(category => (
          <Paper
            key={category.id}
            withBorder
            radius="md"
            p="lg"
          >
            <Stack gap="md">
              <Group>
                <DynamicIcon iconId={category.iconId} />

                <Stack gap={0}>
                  <Title order={3}>
                    {category.id}
                  </Title>

                  <Text size="sm" c="dimmed">
                    {category.description}
                  </Text>
                </Stack>
              </Group>

              <Stack gap="sm">
                {tags
                  .filter(tag => tag.category.id === category.id)
                  .map(tag => {
                    const selected = selectedTags.has(tag.id);

                    return (
                      <Card
                        key={tag.id}
                        withBorder
                        radius="md"
                        p="md"
                        style={{
                          cursor: "pointer",
                          borderColor: selected
                            ? "var(--mantine-primary-color-filled)"
                            : undefined,
                        }}
                        onClick={() => onToggleTag(tag.id)}
                      >
                        <Group align="flex-start">
                          <Checkbox
                            checked={selected}
                            onChange={() => onToggleTag(tag.id)}
                            onClick={event => event.stopPropagation()}
                          />

                          <Stack gap={2}>
                            <Group gap="xs">
                                <DynamicIcon iconId={tag.iconId} />

                                <Text fw={600}>
                                  {tag.id}
                                </Text>
                            </Group>

                            <Text size="sm" c="dimmed">
                              {tag.description}
                            </Text>
                          </Stack>
                        </Group>
                      </Card>
                    );
                  })}
              </Stack>
            </Stack>
          </Paper>
        ))}

        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {selectedTags.size} tag{selectedTags.size === 1 ? "" : "s"} selected
          </Text>

          <Button
            onClick={onAccept}
            loading={isSubmitting}
            leftSection={<CheckIcon />}
          >
            Accept
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
