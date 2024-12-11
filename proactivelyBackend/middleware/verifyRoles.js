const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            console.log("'roles' does not exist. error encountered!");
            return res.sendStatus(401);
        }
        const rolesArray = [...allowedRoles];
        const reqRoles = Array.isArray(req.roles) ? req.roles : [req.roles];

        console.log("printing from verifyRoles: ");
        console.log(rolesArray);
        console.log(req.roles);

        const result = reqRoles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) {
            console.log("No result.");
            return res.sendStatus(401);
        }
        next();
    }
}

module.exports = verifyRoles