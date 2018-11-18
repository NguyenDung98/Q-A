let questionHelper = require("../helpers/question"),
    sessionHelper  = require('../helpers/session'),
    userHelper     = require('../helpers/user'),
    userType       = require('../models/userType'),
    router         = require('express').Router();
const middleware = require("../middleware");

router.get('/', middleware.isNotLoggedIn, (req, res) => {
    res.render('login');
});

// route xác thực người dùng
router.post('/login', middleware.isNotLoggedIn ,async (req, res) => {
    try {
        const response = await userHelper.verifyUser(req.body.username, req.body.password);
        if (response) {
            req.session.userInfo = response;
            if (req.session.userInfo.role === userType.lecturer) {
                res.redirect('/lecturer/session');
            } else if (req.session.userInfo.role === userType.student){
                res.redirect('/session');
            } else if (req.session.userInfo.role === userType.admin) {
                res.redirect('/admin/session');
            }
        } else res.send('User is not defined!');
    } catch (error) {
        console.log(error);
    }
});

// đăng xuất người dùng
router.post('/logout', middleware.isLoggedIn, (req, res) => {
    req.session.userInfo = undefined;
    res.redirect('/');
});

router.get('/admin/user', middleware.isAdmin, (req, res) => {
    res.render('userManagement')
});

module.exports = router;