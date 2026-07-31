import { useEffect, useState, useRef } from "react";
import { useParams, type Session } from "react-router";
import { useBackend } from "../client/BackendContext";
import { rawActivitiesToActivities, type ApplicationData, type RawActivity } from "../model/application-data";
import TagSelection from "./TagSelection";
import WaitingForParticipant from "./WaitingForParticipant";
import SessionResults from "./SessionResults";

import { Center, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type Actvity from "../model/activity";
import type { SessionResponse } from "../client/responses";

export default function SessionPage() {
  const { sessionId, userToken } = useParams();
  const backend = useBackend();

  const [applicationData, setApplicationData] = useState<ApplicationData>();
  const [acceptedTokens, setAcceptedTokens] = useState<string[]>();
  const [filteredActivities, setFilteredActivities] = useState<Actvity[] | null>();
  const [chosenActivity, setChosenActivity] = useState<Actvity | null>();

  const [selectedTags, setSelectedTags] = useState(new Set<string>());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wasNotifiedForAcceptance = useRef(false);

  function setActivitiesUsingRawAndTags(sessionResponse: SessionResponse, applicationData: ApplicationData): void {
    const tagsArray = Array.from(applicationData.tags);
    const rawFilteredActivities: RawActivity[] = sessionResponse.filteredActivities;
    const fullFilteredActivities: Actvity[] = rawActivitiesToActivities(rawFilteredActivities, tagsArray);
    setFilteredActivities(fullFilteredActivities);
    const rawChosenActivity: RawActivity = sessionResponse.chosenActivity;
    const fullChosenActivity: Actvity = rawActivitiesToActivities([rawChosenActivity], tagsArray)[0];
    setChosenActivity(fullChosenActivity);
  }

  useEffect(() => {
    if (!sessionId) return;

    async function load() {
      try {
        const [applicationData, sessionResponse] = await Promise.all([
          backend.raw.getRawData(),
          backend.sessions.getSession(sessionId),
        ]);

        setApplicationData(applicationData);
        setAcceptedTokens(sessionResponse.acceptedTokens);
        setActivitiesUsingRawAndTags(sessionResponse, applicationData);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [backend, sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    return backend.sessions.subscribe(sessionId, event => {
      setAcceptedTokens(previous => {
        const previousCount = previous?.length ?? 0;
        const newCount = event.acceptedTokens.length;

        // Another participant accepted while this user is still choosing tags
        if (
          previousCount < newCount &&
          userToken &&
          !event.acceptedTokens.includes(userToken) &&
          !wasNotifiedForAcceptance.current
        ) {
          wasNotifiedForAcceptance.current = true;

          notifications.show({
            title: "Participant joined",
            message: "The other participant has accepted their tags.",
            color: "blue",
          });
        }

        return event.acceptedTokens;
      });
    });
  }, [backend, sessionId, userToken]);

  useEffect(() => {
    wasNotifiedForAcceptance.current = false;
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    if (acceptedTokens?.length !== 2) return;

    async function loadResults() {
      try {
        const sessionResponse = await backend.sessions.getSession(sessionId);
        setActivitiesUsingRawAndTags(sessionResponse, applicationData);
      } catch (err) {
        console.error(err);
      }
    }

    loadResults();
  }, [backend, sessionId, acceptedTokens]);

  async function accept() {
    if (!sessionId || !userToken) return;

    try {
      setIsSubmitting(true);

      const response = await backend.sessions.accept(
        sessionId,
        userToken,
        [...selectedTags],
      );

      setAcceptedTokens(response.acceptedTokens);

      const sessionResponse = await backend.sessions.getSession(sessionId);

      setActivitiesUsingRawAndTags(sessionResponse, applicationData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTags(previous => {
      const next = new Set(previous);

      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }

      return next;
    });
  }

  const hasUserAccepted =
    !!userToken &&
    acceptedTokens?.includes(userToken);

  const hasEveryoneAccepted =
    acceptedTokens?.length === 2;

  if (!hasUserAccepted) {
    if (!applicationData) {
      return (
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      );
    }

    return (
      <TagSelection
        applicationData={applicationData}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        onAccept={accept}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (!hasEveryoneAccepted) {
    return (
      <WaitingForParticipant
        acceptedCount={acceptedTokens?.length ?? 0}
      />
    );
  }

  return (
    <SessionResults
      filteredActivities={filteredActivities}
      chosenActivity={chosenActivity}
    />
  );
}
