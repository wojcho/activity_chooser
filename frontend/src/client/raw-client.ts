import type { ApplicationData } from "../model/application-data";
import type Tag from "../model/tag";
import type TagCategory from "../model/tag-category";
import ApiClient from "./api-client";
import type { RawApplicationData } from "../model/application-data";
import type Actvity from "../model/activity";

export function rawApplicationDataToApplicationData(raw: RawApplicationData): ApplicationData {
  const categoryMap = new Map<string, TagCategory>();

  for (const rawCategory of raw.tagCategories) {
    categoryMap.set(rawCategory.id, {
      id: rawCategory.id,
      description: rawCategory.description,
      iconId: rawCategory.iconId,
    });
  }

  const tagMap = new Map<string, Tag>();

  for (const rawTag of raw.tags) {
    const category = categoryMap.get(rawTag.categoryId);

    if (!category) {
      throw new Error(
        `Tag '${rawTag.id}' references unknown category '${rawTag.categoryId}'`
      );
    }

    tagMap.set(rawTag.id, {
      id: rawTag.id,
      description: rawTag.description,
      iconId: rawTag.iconId,
      category,
    });
  }

  const activities = new Set<Actvity>();

  for (const rawActivity of raw.activities) {
    const tags = new Set<Tag>();

    for (const tagId of rawActivity.tags) {
      const tag = tagMap.get(tagId);

      if (!tag) {
        throw new Error(
          `Activity '${rawActivity.id}' references unknown tag '${tagId}'`
        );
      }

      tags.add(tag);
    }

    activities.add({
      id: rawActivity.id,
      description: rawActivity.description,
      backgroundHref: rawActivity.backgroundHref,
      tags,
    });
  }

  return {
    tagCategories: new Set(categoryMap.values()),
    tags: new Set(tagMap.values()),
    activities,
  };
}


export default class RawClient extends ApiClient {

  async getRawData() {
    return rawApplicationDataToApplicationData(await this.get<RawApplicationData>(
      "/raw",
    ));
  }
}
