const express = require('express')
 
const router = express.Router()
const productController = require('./../controller/product.controller')

router.route('/add-product').post(productController.addingProduct)
router.route('/all-products').post(productController.sendingAllvariety)
router.route('/home-stuff').get(productController.sendingStuffToHomePage)
router.route('/all-products-admin').get(productController.sendingAllProductsToAdmin)
router.route('/add-purchase').post(productController.addingPurchasing)
router.route('/update-products').post(productController.updatingProductPrice)
router.route('/bulk-value').post(productController.makingBulkOrderValues)
router.route('/all-placed-orders').get(productController.sendingAllPlacedOrders)
router.route('/mark-as-packed').post(productController.markingProductPackedAsDone)
router.route('/mark-as-delivered').post(productController.markingProductDeliveredAsDone)
router.route('/cod-collect').post(productController.markingProductCODAsDone)
router.route('/add-combo').post(productController.makeCombo)
router.route('/all-combos').get(productController.sendingAllCombosToAdmin)
router.route('/activation-of-combos').post(productController.activationOfCombos)
router.route('/delete-combo').post(productController.DeleteCombo)
router.route('/admin-prods').get(productController.AllProductsToAdmin)

router.route('/get-approve-orders').post(productController.sendingAllApproveOrdersToDeliveryApp)
router.route('/accept-order-by-boy').post(productController.acceptingOrderByDeliveryBoy)
router.route('/out-of-delivery').post(productController.MakingOrderOutOfDelivery)

module.exports = router 