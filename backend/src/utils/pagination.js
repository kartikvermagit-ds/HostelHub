export const getPaginationParams = (query, defaultLimit = 20, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || String(defaultLimit), 10)));
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
    rangeFrom: offset,
    rangeTo: offset + limit - 1,
  };
};

export const buildPaginationMetadata = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
