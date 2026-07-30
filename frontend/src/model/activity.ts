import Tag from "./tag";

interface Actvity {
  id: string;
  description: string;
  backgroundHref: string;
  tags: Set<Tag>;
}

export default Actvity;
