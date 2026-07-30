import type Actvity from "./activity";
import type Tag from "./tag";
import type TagCategory from "./tag-category";

export interface ApplicationData {
  tagCategories: Set<TagCategory>;
  tags: Set<Tag>;
  activities: Set<Actvity>;
}

export interface RawTagCategory {
  id: string;
  description: string;
  iconId: string;
}

export interface RawTag {
  id: string;
  description: string;
  iconId: string;
  categoryId: string;
}

export interface RawActivity {
  id: string;
  description: string;
  backgroundHref: string;
  tags: string[];
}

export interface RawApplicationData {
  tagCategories: RawTagCategory[];
  tags: RawTag[];
  activities: RawActivity[];
}

export function rawActivitiesToActivities(
  rawActivities: RawActivity[],
  tags: Tag[],
): Actvity[] {
  const tagMap = new Map(
    tags.map(tag => [tag.id, tag]),
  );

  return rawActivities.map(rawActivity => ({
    id: rawActivity.id,
    description: rawActivity.description,
    backgroundHref: rawActivity.backgroundHref,
    tags: new Set(
      rawActivity.tags.map(tagId => {
        const tag = tagMap.get(tagId);

        if (!tag) {
          throw new Error(`Unknown tag id: ${tagId}`);
        }

        return tag;
      }),
    ),
  }));
}

export function activitiesToRawActivities(
  activities: Actvity[],
): RawActivity[] {
  return activities.map(activity => ({
    id: activity.id,
    description: activity.description,
    backgroundHref: activity.backgroundHref,
    tags: [...activity.tags].map(tag => tag.id),
  }));
}
