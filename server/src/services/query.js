const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

 function getPagination(query) {
  //now if one does not give page in query
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  //now if one does not give a limit, then we show all response
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  return {
    limit,
    skip,
  };
}


export {getPagination}