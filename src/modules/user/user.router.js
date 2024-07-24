import { Router } from "express"
import * as userController from './controller/user.controller.js'
import validation from "../../middleware/validation.js"
import * as userValidation from './user.validation.js'
import auth from "../../middleware/auth.js"
import userEndpoint from './user.endpoint.js'
const router = Router()

//signUp
router.post('/signUp'
,validation(userValidation.signupSchema)
,userController.signUp)
//confirmEmail
.get('/confirmEmail/:token'
,validation(userValidation.tokenSchema)
,userController.confirmEmail)
//refreshToken
.get('/refreshToken/:token',
validation(userValidation.tokenSchema),
userController.refreshToken)
//login
.post('/login',
validation(userValidation.loginSchema),
userController.login)
//updateAccount
.put('/update/:userId',
validation(userValidation.authSchema,true),
auth(userEndpoint.update),
validation(userValidation.updateSchema)
,userController.updateAccount)

//delete account
.delete('/delete/:userId',
validation(userValidation.authSchema,true),
auth(userEndpoint.delete),
validation(userValidation.deleteSchema),
userController.deleteAccount)

//get account data 
.get('/getData/:userId'
,validation(userValidation.authSchema,true),
auth(userEndpoint.getData),
validation(userValidation.getDataSchema)
, userController.userAccountData)

//profile
.get('/profile/:userId',
validation(userValidation.profileSchema)
, userController.profile)

//updatePassword
.put('/updatePassword/:userId',
validation(userValidation.authSchema,true),
auth(userEndpoint.updatePassword),
validation(userValidation.updatePasswordSchema),
    userController.updatePassword)

    //sendCode
.patch('/sendCode',
validation(userValidation.sendCodeSchema)
    , userController.sendCode)

    //forgetPassword
    .put('/forgetPassword',
    validation(userValidation.forgetPasswordSchema),
        userController.forgetPassword)
    
//accounts with recoveryemail
    .get('/recoveryAccounts'
    ,validation(userValidation.recoveryEmailSchema)
        , userController.allAccounts)

export default router