import { CodePlayground } from '@prisma/client';

const getPlaygroundsDataByTags = (
  playgroundsData: CodePlayground[],
  tag: string
) => {
  return playgroundsData.filter((playground) => playground.tags.includes(tag));
};

export default getPlaygroundsDataByTags;
