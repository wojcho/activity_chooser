import Actvity from "./activity";
import Tag from "./tag";
import TagCategory from "./tag-category";

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
