import Actvity from "../model/activity";
import TagCategory from "../model/tag-category";

export interface ApplicationData {
  tagCategories: Set<TagCategory>;
  tags: Set<Tag>;
  activities: Set<Actvity>;
}

export function importApplicationData(): ApplicationData {
  ;
}
