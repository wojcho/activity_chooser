import type TagCategory from "./tag-category";

export default interface Tag {
  id: string;
  description: string;
  iconId: string;
  category: TagCategory;
}
