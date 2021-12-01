const KEY_SECRET = (!process.env.KEYSECRET || process.env.KEYSECRET.length != 32) ? "sE78zFoeY19jJxvYi1PHfRcq8WFjbyTf":process.env.KEYSECRET;
const JWT_SECRET = process.env.JWTSECRET || "imdCompanyByBackendDev";
const JWT_SECRET_PORTAL = process.env.JWTSECRETPORTAL || "BraumIsNo1ImMyHeart";

module.exports = {
    KEY_SECRET,
    JWT_SECRET,
    JWT_SECRET_PORTAL,
};