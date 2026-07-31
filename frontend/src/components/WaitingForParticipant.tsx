import {
  Container,
  Loader,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";

type Props = {
  acceptedCount: number;
};

export default function WaitingForParticipant({
  acceptedCount,
}: Props) {
  return (
    <Container size="sm" py="xl">
      <Paper p="xl" shadow="sm" radius="md">
        <Stack align="center">
          <Loader />

          <Title order={2}>Waiting for participant</Title>

          <Text c="dimmed" ta="center">
            Waiting for the other participant to submit their choices
          </Text>

          <Progress
            value={(acceptedCount / 2) * 100}
            w="100%"
          />

          <Text fw={500}>
            {acceptedCount} of 2 participants ready
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
