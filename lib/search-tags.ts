const searchTags = (tags: string[], searchInput: string) => {
  if (!searchInput) {
    return tags;
  }

  return tags.filter((tag) =>
    tag.toLowerCase().includes(searchInput.toLowerCase())
  );
};

export default searchTags;
