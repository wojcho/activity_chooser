import {
  Alert,
  Container,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { CheckIcon, ConfettiIcon } from "@phosphor-icons/react";
import type { RawActivity } from "../model/application-data";

type Props = {
  filteredActivities: RawActivity[] | null | undefined;
  chosenActivity: RawActivity | null | undefined;
};

export default function SessionResults({
  filteredActivities,
  chosenActivity,
}: Props) {
  return (
    <Container size="md" py="xl">
      <Stack>
        <Paper p="xl" shadow="sm" radius="md">
          <Stack>
            <Title order={2}>Matching activities</Title>

            {filteredActivities?.length ? (
              <List
                spacing="sm"
                icon={
                  <CheckIcon />
                }
              >
                {filteredActivities.map(activity => (
                  <List.Item key={activity.id}>
                    {activity.description}
                  </List.Item>
                ))}
              </List>
            ) : (
              <Text c="dimmed">
                No matching activities were found.
              </Text>
            )}
          </Stack>
        </Paper>

        {chosenActivity && (
          <Alert
            color="teal"
            variant="light"
            icon={<ConfettiIcon />}
            title="Chosen activity"
          >
            {chosenActivity.description}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
