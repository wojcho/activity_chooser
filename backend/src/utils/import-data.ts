import fs from "fs";
import path from "path";
import Ajv from "ajv";

import Activity from "../model/activity";
import Tag from "../model/tag";
import TagCategory from "../model/tag-category";
import { ApplicationData, RawApplicationData } from "../model/application-data";

const DATA_DIR = path.resolve(__dirname, "../../data");

function readJsonFile<T>(filename: string): T {
  const file = path.join(DATA_DIR, filename);
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function importApplicationData(): ApplicationData {
  const schema = readJsonFile<Object>("categories-tags-activities-schema.json");
  const raw = readJsonFile<RawApplicationData>("data.json");

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (!validate(raw)) {
    throw new Error(
      "Invalid data.json:\n" +
      ajv.errorsText(validate.errors, { separator: "\n" })
    );
  }

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

  const activities = new Set<Activity>();

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

export function importWordList(): string[] {
  return readJsonFile<string[]>("wordlist.json");
}

export const applicationData: ApplicationData = importApplicationData();
export const wordList: string[] = importWordList();
