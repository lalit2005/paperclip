import { CodePlayground } from '@prisma/client';

const getUniquePlaygroundTags = (playgroundsData: CodePlayground[]) => {
  const allTags = playgroundsData?.reduce((acc, playground) => {
    return acc.concat(playground.tags);
  }, []);
  return allTags?.filter((tag, index, array) => {
    return array.indexOf(tag) === index;
  }, []);
};

export default getUniquePlaygroundTags;
