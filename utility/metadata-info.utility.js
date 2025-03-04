const getMetadataInfo = (req) => {
    return {
        account_id: req.user?.account_id || "unknown_account",
        current_datetime: req.datetime || new Date()
    };
};

module.exports = {
    getMetadataInfo
};
