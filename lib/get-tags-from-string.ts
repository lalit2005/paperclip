const getTagsFromString = (string: string): string[] => {
  // Get the tags from the string by splitting on the commas and commas with spaces
  return string.toLocaleLowerCase().split(/, ?/g);
};

export default getTagsFromString;
