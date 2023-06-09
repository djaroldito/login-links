const { Router } = require ('express')
const router = Router()
const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth')

router.get('/signup', isNotLoggedIn, (req,res)=>{
    res.render('auth/signup.hbs')
})

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
        successRedirect:'/profile',
        failureRedirect:'/signup',
        failureFlash:true
    }))

router.get('/signin', isNotLoggedIn, (req,res)=>{
    res.render('auth/signin.hbs')
})

router.post('/signin', isNotLoggedIn, (req,res,next)=>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash:true
    })(req,res,next)
})

router.get('/profile', isLoggedIn, (req,res)=>{ 
    res.render('profile.hbs')
})

// router.get('/logout', (req, res)=>{
//     req.logOut()
//     res.redirect('/signin')
// })
 
// router.get('/logout', function(req, res){
//     req.logout(function(err) {
//       if (err) { return next(err); }
//       res.redirect('/signin');
//     });
//   });

  router.get('/logout', isLoggedIn, (req, res)=>{
    req.logOut((err)=>{
        if(err){return (err)}
        res.redirect('/signin')
    })
  })

module.exports = router