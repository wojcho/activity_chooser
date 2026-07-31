import type Tag from "./tag";

export default interface Actvity {
  id: string;
  description: string;
  backgroundHref: string;
  tags: Set<Tag>;
}
