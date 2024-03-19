const express = require('express')
const router = express.Router()
const auth = require('./../controller/auth.controller')

router.route('/open-acc').post(auth.createAccount)
router.route('/sending-user').post(auth.sendingUSerData)
router.route('/change-address').post(auth.changeAddress)

router.route('/logout').get(auth.LoggingOut)
router.route('/login').post(auth.Login)
router.route('/forgot').post(auth.forgotPassword)
router.route('/add-to-cart').post(auth.cartPreperation)
router.route('/combo-offer').post(auth.PuttingComboToCart)
router.route('/delete-all-cart').get(auth.deleteCompleteCart)
router.route('/list-of-elements-in-cart').post(auth.sendingCartItemsOnlyWithoutCalculations)

router.route('/cart-items').post(auth.sendingAlreadyAddedCart)
router.route('/cart-update').post(auth.updatingUnits)
router.route('/online-payment').post(auth.onlinePayment)
router.route('/payment-validate').post(auth.validatingPays)
router.route('/cod-payment').post(auth.codAndPlacingOrder)
router.route('/placed_orders').post(auth.sendingPlacedOrder)
router.route('/feedback').post(auth.feedback)
router.route('/delete').post(auth.deletingCartItem)
router.route('/complain').post(auth.complain)
router.route('/code').get(auth.code)


module.exports = router
