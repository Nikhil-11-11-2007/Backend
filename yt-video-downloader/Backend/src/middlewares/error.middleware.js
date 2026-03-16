export default function errorMiddleware(err, req, res, next) {

    const statusCode = err.status || 500

    const response = {
        message: err.message || "Enternal server Error"
    }

    res.status(statusCode).json(response)
}