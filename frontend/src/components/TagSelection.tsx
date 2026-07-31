import {
  Button,
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
            <Stack gap="sm">
              <Title order={3}>{category.description}</Title>

              {tags
                .filter(tag => tag.category.id === category.id)
                .map(tag => (
                  <Checkbox
                    key={tag.id}
                    label={tag.description}
                    checked={selectedTags.has(tag.id)}
                    onChange={() => onToggleTag(tag.id)}
                  />
                ))}
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
