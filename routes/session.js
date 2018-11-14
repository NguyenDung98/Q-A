let router = require('express').Router(),
    helpers = require('../helpers/session');

router.route('/')
    .get(helpers.getAllSession)
    .post(helpers.createSession);

router.route("/:sessionID")
    .put(helpers.updateSession)
    .delete(helpers.deleteSession);

module.exports = router;