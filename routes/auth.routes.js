const express = require('express')
const router = express.Router()
const auth = require('./../controller/auth.controller')

router.route('/open-acc').post(auth.createAccount)
router.route('/logout').get(auth.LoggingOut)
router.route('/login').post(auth.Login)
router.route('/forgot').post(auth.forgotPassword)
router.route('/add-to-cart').post(auth.cartPreperation)
router.route('/cart-items').get(auth.sendingAlreadyAddedCart)
router.route('/cart-update').post(auth.updatingUnits)
router.route('/online-payment').get(auth.onlinePayment)
router.route('/payment-validate').post(auth.validatingPays)
router.route('/cod-payment').get(auth.codAndPlacingOrder)
router.route('/placed_orders').get(auth.sendingPlacedOrder)
router.route('/feedback').post(auth.feedback)
router.route('/delete').post(auth.deletingCartItem)
router.route('/complain').post(auth.complain)



module.exports = router
