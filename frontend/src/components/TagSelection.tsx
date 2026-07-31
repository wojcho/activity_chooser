import type { ApplicationData } from "../model/application-data";

type Props = {
  applicationData: ApplicationData;
  selectedTags: Set<string>;
  onToggleTag(tagId: string): void;
  onAccept(): void;
  isSubmitting: boolean;
};

export default function TagSelection({
  applicationData,
  selectedTags,
  onToggleTag,
  onAccept,
  isSubmitting,
}: Props) {
  const categories = [...applicationData.tagCategories];
  const tags = [...applicationData.tags];

  return (
    <section id="center">
      <h1>Select allowed tags</h1>

      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.description}</h2>

          {tags
            .filter(tag => tag.category.id === category.id)
            .map(tag => (
              <label
                key={tag.id}
                style={{ display: "block" }}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.has(tag.id)}
                  onChange={() => onToggleTag(tag.id)}
                />

                {tag.description}
              </label>
            ))}
        </div>
      ))}

      <button
        onClick={onAccept}
        disabled={isSubmitting}
      >
        Accept
      </button>
    </section>
  );
}
