import { z, ZodSchema } from "zod";

export const paginationMetadataSchema = z.object({
  limit: z.number(),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

export type PaginationMetadata = z.infer<typeof paginationMetadataSchema>;

export const createPaginationSchema = <T>(dataSchema: ZodSchema<T>) => {
  return paginationMetadataSchema.extend({
    data: dataSchema.array(),
  });
};
