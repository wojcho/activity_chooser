import Activity from "../src/model/activity";
import Tag from "../src/model/tag";
import TagCategory from "../src/model/tag-category";
import { ApplicationData } from "../src/model/application-data";

export function createFixtureData(): {
  applicationData: ApplicationData;
  category: TagCategory;
  tags: Record<string, Tag>;
  activities: Record<string, Activity>;
} {
  const category: TagCategory = {
    id: "sports",
    description: "Sports",
    iconId: "sports",
  };

  const football: Tag = {
    id: "football",
    description: "Football",
    iconId: "football",
    category,
  };

  const outdoor: Tag = {
    id: "outdoor",
    description: "Outdoor",
    iconId: "outdoor",
    category,
  };

  const cooking: Tag = {
    id: "cooking",
    description: "Cooking",
    iconId: "cooking",
    category,
  };

  const playFootball: Activity = {
    id: "play-football",
    description: "Play football",
    backgroundHref: "/football.jpg",
    tags: new Set([football, outdoor]),
  };

  const walkAround: Activity = {
    id: "walk-around",
    description: "Walk around",
    backgroundHref: "/walk.jpg",
    tags: new Set([outdoor]),
  };

  return {
    applicationData: {
      tagCategories: new Set([category]),
      tags: new Set([football, outdoor, cooking]),
      activities: new Set([playFootball, walkAround]),
    },
    category,
    tags: {
      football,
      outdoor,
      cooking,
    },
    activities: {
      playFootball,
      walkAround,
    },
  };
}

