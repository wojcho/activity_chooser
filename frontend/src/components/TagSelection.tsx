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

  onSelectAll(): void;
  onClearAll(): void;

  onSelectCategory(categoryId: string): void;
  onClearCategory(categoryId: string): void;

  onAccept(): void;
  isSubmitting: boolean;
};

export default function TagSelection({
  applicationData,
  selectedTags,
  onToggleTag,
  onSelectAll,
  onClearAll,
  onSelectCategory,
  onClearCategory,
  onAccept,
  isSubmitting,
}: Props) {
  const categories = [...applicationData.tagCategories];
  const tags = [...applicationData.tags];

  const totalTags = applicationData.tags.size;
  const selectedCount = selectedTags.size;

  const allSelected = selectedCount === totalTags;
  const noneSelected = selectedCount === 0;

  return (
    <Container size="md" py="xl">
      <Stack>
        <Paper shadow="sm" radius="md" p="xl">
          <Stack>
            <Title order={1}>Choose your preferences</Title>

            <Text c="dimmed">
              Select every tag that is acceptable for you.
              Only activities matching selections of both participants will be considered.
            </Text>
          </Stack>
        </Paper>

        <Group>
          {!allSelected && (
            <Button
              variant="subtle"
              onClick={onSelectAll}
            >
              Select All
            </Button>
          )}

          {!noneSelected && (
            <Button
              variant="subtle"
              color="gray"
              onClick={onClearAll}
            >
              Clear All
            </Button>
          )}
        </Group>

        {categories.map(category => {
          const categoryTags = tags.filter(tag => tag.category.id === category.id);
          const selectedInCategory = categoryTags.filter(tag =>
            selectedTags.has(tag.id),
          ).length;
          const allSelectedInCategory = selectedInCategory === categoryTags.length;
          const noneSelectedInCategory = selectedInCategory === 0;
          return (
            <Paper
              key={category.id}
              withBorder
              radius="md"
              p="lg"
            >
              <Stack gap="md">
                <Group justify="space-between">
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

                  <Group gap="xs">
                    {!allSelectedInCategory && (
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={() => onSelectCategory(category.id)}
                      >
                        Select All in Category
                      </Button>
                    )}

                    {!noneSelectedInCategory && (
                      <Button
                        size="xs"
                        variant="subtle"
                        color="gray"
                        onClick={() => onClearCategory(category.id)}
                      >
                        Clear All in Category
                      </Button>
                    )}
                  </Group>

                </Group>

                <Stack gap="sm">
                  {categoryTags.map(tag => {
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
          );
        })}
        

        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {selectedTags.size} tag{selectedTags.size === 1 ? "" : "s"} selected / {applicationData.tags.size} tag{applicationData.tags.size === 1 ? "" : "s"} total
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
