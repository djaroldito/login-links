const { Router } = require ('express')
const router = Router()
const { isLoggedIn } = require('../lib/auth')

const pool = require('../database.js')

router.get('/links/add', isLoggedIn, (req,res)=>{
    res.render('links/add')
})


router.post('/links/add', isLoggedIn, async (req, res)=>{ 
    const { title, url, description } = req.body
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    }
     try {
        const result = await pool.query('INSERT INTO links set ?', [newLink])
        req.flash('success','Link Save Ok')
        res.redirect('/links') 
               
     } catch (error) {
        res.status(500).json('Hubo un error al agregar el link')
     }
})

router.get('/links', isLoggedIn, async (req,res)=>{
    
    try {
        const result = await pool.query('select * from links WHERE user_id = ?', [req.user.id])
        res.render('links/list', {result})

    } catch (error) {
        console.log(error.message)
        res.status(500).json('Error en mostrar Links')
    }
})

router.get('/links/delete/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params
    try {
        await pool.query('DELETE FROM links WHERE id = ?', [id])
        req.flash('success','Link Delete Ok')
        res.redirect('/links') 
       
       
     } catch (error) {
        console.log(error.message)
        res.status(500).json('Hubo un error al borrar el link')
     }


})

router.get('/links/edit/:id', isLoggedIn, async (req,res)=>{
      try {
        const { id } = req.params
        const links = await pool.query('SELECT * FROM links WHERE id = ?', [id] )
        
        res.render('links/edit', {pepe: links[0]})
    } catch (error) {
        res.status(500).json('Error en editar')
    }
})

router.post('/links/edit/:id', isLoggedIn, async (req, res)=>{
    const { id } = req.params
    const { title, url, description } = req.body
    const newLink = {
        title,
        description,
        url
    }
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id])
    req.flash('success','Link Update Ok')
    res.redirect('/links')
})

module.exports = router