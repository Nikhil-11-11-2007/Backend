

function handleError(err, req, res, next) {

    const response = {
        message: err.message
    }
    
    if(process.env.NODE_ENVIROMENT === "development"){
        response.stack = err.stack
    }

    res.status(err.status).json(response)
}

module.exports = handleError