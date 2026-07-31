import {
  Button,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <Container size="sm" py="xl">
      <Paper p="xl" shadow="sm" radius="md">
        <Stack align="center">
          <Title order={1}>404</Title>

          <Text c="dimmed">
            The page you're looking for doesn't exist
          </Text>

          <Button component={Link} to="/">
            Back to home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
