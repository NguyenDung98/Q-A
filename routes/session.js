let router = require('express').Router(),
    helpers = require('../helpers/session');

router.route('/')
    .get(helpers.getAllSession)
    .post(helpers.createSession);

// router.route("/:questionID")
//     .put(helpers.updateQuestion);

module.exports = router;