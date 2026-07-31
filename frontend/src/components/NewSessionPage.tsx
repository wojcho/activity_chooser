import {
  Anchor,
  Button,
  Container,
  CopyButton,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Link, useParams } from "react-router";

export default function NewSessionPage() {
  const { sessionId, aUserToken, bUserToken } = useParams();

  const aLink = `/session/${sessionId}/${aUserToken}`;
  const bLink = `/session/${sessionId}/${bUserToken}`;

  const full = (path: string) => `${window.location.origin}${path}`;

  return (
    <Container size="md" py="xl">
      <Paper p="xl" shadow="sm" radius="md">
        <Stack>
          <Title order={1}>Session created</Title>

          <Text c="dimmed">
            Send one of these links to each participant.
          </Text>

          {[
            ["User A", aLink],
            ["User B", bLink],
          ].map(([label, path]) => (
            <Paper key={label} withBorder p="md">
              <Stack gap="xs">
                <Title order={4}>{label}</Title>

                <Anchor component={Link} to={path}>
                  {full(path)}
                </Anchor>

                <CopyButton value={full(path)}>
                  {({ copied, copy }) => (
                    <Button
                      w="fit-content"
                      variant={copied ? "light" : "filled"}
                      color={copied ? "teal" : "blue"}
                      leftSection={
                        copied
                          ? <CheckIcon />
                          : <CopyIcon />
                      }
                      onClick={copy}
                    >
                      {copied ? "Copied" : "Copy link"}
                    </Button>
                  )}
                </CopyButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}
