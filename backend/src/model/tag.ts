import TagCategory from "./tag-category";

interface Tag {
  id: string;
  description: string;
  iconId: string;
  category: TagCategory;
}

export default Tag;
