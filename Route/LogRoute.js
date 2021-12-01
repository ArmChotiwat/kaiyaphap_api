// *** Route => /log
const express = require('express');
const router = express.Router();

const requireJWTAuth = require("../Middleware/jwt");
router.use(requireJWTAuth);

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

router.get(
    '/schedule/after',
    (req, res) => {
        const payload = req.body;
    }
);


module.exports = router;