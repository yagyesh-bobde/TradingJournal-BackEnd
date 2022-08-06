const jwt = require('jsonwebtoken')

const fetchuser = (req, res, next) => {
    const jwtToken = req.header('jwt-token')
    if (!jwtToken) {
        return res.status(401).status({error: "This action requires the user to login"})
    }
    try {
        const data = jwt.verify(jwtToken, process.env.JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        return res.status(401).status({error: "This action requires the user to login"})
    }
}

module.exports = fetchuser
