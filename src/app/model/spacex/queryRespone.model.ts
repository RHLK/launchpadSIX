
/**
 * SpaceX Query Response Interface
 * Represents the paginated structure returned by the /query endpoints.
 */
export interface QueryResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  }