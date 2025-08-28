// filepath: d:\公車車型介紹\back\routes\user.js
import { Router } from 'express'
import * as user from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

router.post('/', user.create)
router.post('/login', auth.login, user.login)
router.get('/profile', auth.token, user.profile)
router.patch('/refresh', auth.token, user.refresh)
router.delete('/logout', auth.token, user.logout)
router.get('/all', auth.token, auth.admin, user.getAll)
router.patch('/changerole',  auth.token, auth.admin, user.changerole)

router.post('/delete', auth.token, auth.admin, user.del)

export default router
