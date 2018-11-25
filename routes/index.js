let userHelper     = require('../helpers/user'),
    userType       = require('../models/userType'),
    router         = require('express').Router();
const middleware = require("../middleware");

router.get('/', middleware.isNotLoggedIn, (req, res) => {
    res.render('login');
});

// route xác thực người dùng
router.post('/login', middleware.isNotLoggedIn , async (req, res) => {
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
router.get('/logout', middleware.isLoggedIn, (req, res) => {
    req.session.userInfo = undefined;
    res.redirect('/');
});

// chỉnh sửa thông tin cá nhân
router.get('/profile', middleware.isLoggedIn, (req, res) => {
    res.render('userProfile', {userInfo: req.session.userInfo});
});

// quản lí người dùng (admin)
router.get('/admin/user', middleware.isAdmin, (req, res) => {
    res.render('userManagement')
});

module.exports = router;