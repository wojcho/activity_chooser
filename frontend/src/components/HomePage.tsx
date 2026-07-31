import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router";
import { PlusIcon } from "@phosphor-icons/react";
import { useBackend } from "../client/BackendContext";

export default function HomePage() {
  const backend = useBackend();
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    const { sessionId, aToken, bToken } =
      await backend.sessions.createSession();

    navigate(`/new-session/${sessionId}/${aToken}/${bToken}`);
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="sm" radius="md" p="xl">
        <Stack>
          <Title order={1}>Activity Picker</Title>

          <Text c="dimmed">
            Create a session and invite another participant
          </Text>

          <Button
            leftSection={<PlusIcon />}
            onClick={handleCreateSession}
          >
            Create session
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}