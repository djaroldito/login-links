const { Router } = require ('express')
const router = Router()

// app.use(auth)
// app.use(links)

router.get('/',(req,res)=>{
    res.render('index')
})

module.exports = router