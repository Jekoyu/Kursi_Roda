class ErrorQueryException extends Error {
    constructor(message, data = {}) {
        super();
        this.message = message;
        this.data = data;
    }
}

module.exports = {
    ErrorQueryException,
};
