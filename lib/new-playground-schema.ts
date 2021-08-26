import * as z from 'zod';

const newPlaygroundSchema = z.object({
  playgroundName: z
    .string()
    .min(1, "Please enter a title that's at least a character long"),
  tags: z.string(),
});

export default newPlaygroundSchema;
