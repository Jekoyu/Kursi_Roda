const getPagination = (pageNumber = 1, pageSize = 10) => {
    return {
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize
    };
};

module.exports = {
    getPagination
};
