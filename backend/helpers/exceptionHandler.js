function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: "The user is not authorized" })
    }

    if (err.name === 'ValidationError') {
        return res.status(401).json({ message: err })
    }

    return res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
}

module.exports = errorHandler;