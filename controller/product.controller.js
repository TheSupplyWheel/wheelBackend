const Product = require("./../model/product.model");
const SignUp = require("./../model/auth.model");
const mongoose = require("mongoose");
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.addingProduct = async (req, res, next) => {
  const { name, price, variety,image } = req.body;
  const addproduct = await Product.create({ name, price, variety,image });
  res.status(200).json({
    status: "success",
    data: {
      message: "product added sucessfully",
    },
  });
};

exports.sendingAllvariety = async (req, res, next) => {
  const items = await Product.find();
  const token = req.body;
  console.log(token)
  const itemsSendableArray = [];
  items.forEach((el) => {
    const obj = {
      name: el.name,
      price: el.price,
      quantity: 0,
      variety: el.variety,  
    };
    itemsSendableArray.push(obj);
  });
  if (token.token==='logout') {
    res.status(200).json({
      status: "success",
      data: {
        nameArr: [],
        items: items,
      },
    }); 
    return;
  }
  const decode = await promisify(jwt.verify)(token, process.env.STRING);
  const findingUser = await SignUp.findById(decode.id);
  console.log(findingUser)
  const cart = findingUser.cart;
  let price = 0;
  cart.forEach((el) => {
    itemsSendableArray.forEach((item) => {
      if (item.name === el.itemName) {
        item.quantity = el.units;
      }
    });
    price = Number(el.price.split("/-")[0] * el.units) + price;
  });

  const nameArr = [];
  const nameAndQuantityArr = [];
  findingUser.cart.forEach((el) => {
    nameArr.push(el.itemName);
    nameAndQuantityArr.push([el.itemName, el.units]);
  });

  
  res.status(200).json({
    status: "success",
    data: {
      nameArr,
      price,
      nameAndQuantityArr,
      items: itemsSendableArray,
    },
  });
};

exports.updatingProductPrice = async (req, res, next) => {
  const { list } = req.body;
  list.forEach(async ItemFromFrontend=>{
    const items = await Product.find();
    items.forEach(itemFromDB=>{
      if(ItemFromFrontend.name === itemFromDB.name){
        itemFromDB.price = ItemFromFrontend.price
      }
      itemFromDB.save()
    })
  })
  // items.save()
  const allProducts = await Product.find()
  res.status(200).json({
    status: "success",
    data: {
      allProducts,
      message: "updated",
    },
  });
};

exports.makingBulkOrderValues = async (req, res, next) => {
  const {date} = req.body;
  
  const allProdcuts = await Product.find();
  const nameOfProductsArr = [];

  allProdcuts.forEach((el) => {
    nameOfProductsArr.push(el.name);
  });

  const ALlPlacedOrders = await SignUp.find();
  const allOrderArr = [];
  ALlPlacedOrders.forEach((el) => {
    allOrderArr.push(...el.placed_orders);
  });

  const listItems = [];
  allOrderArr.forEach((el) => {
    if(el.date === date && el.delivered!=='delivered'){
      listItems.push(...el.item_list);
    }else{

    }
  });

  let bulkunits = 0;
  const bulkData = [];

  nameOfProductsArr.forEach((el) => {
    listItems.forEach((item) => {
      if (el.toLowerCase() === item.itemName.toLowerCase()) {
        bulkunits += Number(item.units);
      }
    });
    bulkData.push({
      name: el,
      units: bulkunits,
    });
    bulkunits = 0;
  });

  const finalBulkData = bulkData.filter((el) => {
    if (el.units != 0) {
      return el;
    }
  });

  console.log(finalBulkData);

  res.status(200).json({
    status: "success",
    data: {
      finalBulkData,
    },
  });
};


exports.sendingAllPlacedOrders = async (req, res, next) => {
  const allOrders = await SignUp.find();
  const placed_orders = [];
  allOrders.forEach((el) => {
    placed_orders.push(...el.placed_orders);
  });

  res.status(200).json({
    status: "success",
    data: {
      placed_orders,
    },
  });
};

exports.markingProductPackedAsDone = async (req, res, next) => {
  const { order_id, customer_id } = req.body;
  const findingUser = await SignUp.find();
  const filteressUser = findingUser.filter((el) => {
    if (String(el._id) === customer_id) {
      return el;
    }
  });

  const orders = filteressUser[0].placed_orders;

  orders.forEach((el) => {
    console.log(String(el._id) === order_id);
    console.log(String(el._id));
    console.log(order_id);

    if (String(el._id) === order_id) {
      el.packed = "packed";
    }
  });
  filteressUser[0].save();

  const allOrders = await SignUp.find();
  const placed_orders = [];
  allOrders.forEach((el) => {
    placed_orders.push(...el.placed_orders);
  });

  res.status(200).json({
    status: "success",
    data: {
      message: "packed",
      placed_orders: placed_orders,
    },
  });
};

exports.markingProductDeliveredAsDone = async (req, res, next) => {
  const { order_id, customer_id } = req.body;
  const findingUser = await SignUp.find();
  const filteressUser = findingUser.filter((el) => {
    if (String(el._id) === customer_id) {
      return el;
    }
  });

  const orders = filteressUser[0].placed_orders;

  orders.forEach((el) => {
    console.log(String(el._id) === order_id);
    console.log(String(el._id));
    console.log(order_id);

    if (String(el._id) === order_id) {
      el.delivered = "delivered";
    }
  });
  filteressUser[0].save();

  const allOrders = await SignUp.find();
  const placed_orders = [];
  allOrders.forEach((el) => {
    placed_orders.push(...el.placed_orders);
  });

  res.status(200).json({
    status: "success",
    data: {
      message: "delivered",
      placed_orders: placed_orders,
    },
  });
};

exports.markingProductCODAsDone = async (req, res, next) => {
  const { order_id, customer_id } = req.body;
  const findingUser = await SignUp.find();
  const filteressUser = findingUser.filter((el) => {
    if (String(el._id) === customer_id) {
      return el;
    }
  });

  const orders = filteressUser[0].placed_orders;

  orders.forEach((el) => {
    console.log(String(el._id) === order_id);
    console.log(String(el._id));
    console.log(order_id);

    if (String(el._id) === order_id) {
      el.payment_status = "success";
    }
  });
  filteressUser[0].save();

  const allOrders = await SignUp.find();
  const placed_orders = [];
  allOrders.forEach((el) => {
    placed_orders.push(...el.placed_orders);
  });

  res.status(200).json({
    status: "success",
    data: {
      message: "delivered",
      placed_orders: placed_orders,
    },
  });
};

const combooffers = [
  {
    offer_number: 1,
    items: [
      {
        name: "allo",
        units: "",
      },
      {
        name: "tomato",
        units: "",
      },
      {
        name: "onion",
        units: "",
      },
      {
        name: "lasan",
        units: "250gm",
      },
      {
        name: "adrak",
        units: "250gm",
      },
    ],
  },
  {
    offer_number: 1,
    items: [
      {
        name: "apple",
        units: "",
      },
      {
        name: "papita",
        units: "",
      },
      {
        name: "banana",
        units: "6 piece",
      },
    ],
  },
];

exports.sendingStuffToHomePage = async (req, res, next) => {
  const products = await Product.find();

  const fruits = products.filter((el) => {
    if (el.variety === "fruits") {
      return el;
    }
  });

  const vegetables = products.filter((el) => {
    if (el.variety === "vegetables") {
      return el;
    }
  });

  const english = products.filter((el) => {
    if (el.variety === "english") {
      return el;
    }
  });

  const frozen = products.filter((el) => {
    if (el.variety === "frozen") {
      return el;
    }
  });

  res.status(200).json({
    status: "success",
    data: {
      fruits: fruits.slice(0, 5),
      vegetables: vegetables.slice(0, 5),
      english: english.slice(0, 5),
      frozen: frozen.slice(0, 5),
      combo: combooffers,
      allStuff : [...fruits, ...vegetables, ...english, ...frozen]
    },
  });
};



exports.sendingAllProductsToAdmin = async(req, res, next)=>{
  const items = await Product.find()
  res.status(200).json({
    status : 'success',
    data : {
      items
    }
  })
}


exports.addingPurchasing = async(req, res, next)=>{
  const {name,price} = req.body;
  const items = await Product.find();
  items.forEach(el=>{
    if(el.name === name){
      el.purchasingPrice.push({
        price : price
      })
    }
    el.save()
  })
 
 

  res.status(200).json({
    status : 'success',
    data : {
      message : 'purchase added',
    }
  })
}


const combo = require('./../model/combo.model');

exports.makeCombo = async(req, res, next)=>{
  const {comboList,price} = req.body;
  const createCombo = await combo.create({})
  comboList.forEach(el=>{
    createCombo.comboProduct.push(el)
  })

  createCombo.price = price

  createCombo.save()
  res.status(200).json({
    status : 'success',
    data : {
      message : 'Combo created',
    }
  })

}


exports.sendingAllCombosToAdmin = async(req, res, next)=>{
  const allCombos = await combo.find()
  res.status(200).json({
    status : 'success',
    data : {
      allCombos
    }
  })
}


exports.activationOfCombos = async(req, res, next)=>{
  const {id,activation} = req.body;
  const findingCombo = await combo.find({_id : id})
  if(activation.toLowerCase()==='inactivate'){
    findingCombo[0].activate = false
  }
  if(activation.toLowerCase()==='activate'){
    findingCombo[0].activate = true
  }

  findingCombo[0].save()

  const allCombos = await combo.find()
  console.log(allCombos)

  res.status(200).json({
    status : 'success',
    data : {
      allCombos
    }
  })
}

exports.DeleteCombo = async(req, res, next)=>{
  const {id} = req.body;
  const comboDel = await combo.findByIdAndDelete(id);
  const allCombos = await combo.find()
  res.status(200).json({
    status : 'success',
    data : {
      allCombos
    }
  })
}


exports.AllProductsToAdmin = async(req, res, next)=>{
  const products = await Product.find()

  res.status(200).json({
    status : 'success',
    products : products
  })

}


exports.sendingAllApproveOrdersToDeliveryApp = async(req, res, next)=>{
  const {date} = req.body;
  const users = await SignUp.find()
  const orders = []
  users.forEach(el=>{
    orders.push(...el.placed_orders)
  })
  const approveOrders = []
  orders.forEach(el=>{
    if(new Date().toLocaleDateString() === el.date && el.packed === 'packed' ){
      approveOrders.push(el)
    }
  })

  res.status(200).json({
    status : 'success',
    data : {
      approves : approveOrders
    }
  })

}



exports.acceptingOrderByDeliveryBoy = async(req, res, next)=>{
  const {client_id, order_id, deliveryBoyDetails} = req.body;
  const findingUser = await SignUp.find({_id : client_id})
  const acceptedOrder = []
  findingUser[0].placed_orders.forEach(el=>{
    if(String(el._id)===String(order_id)){
      el.delivery_boy = deliveryBoyDetails.name,
      el.delivery_boy_phone = deliveryBoyDetails.phone
      acceptedOrder.push(el)
    }
  })

  findingUser[0].save()

  res.status(200).json({
    status : 'success',
    data : {
      message : 'Order accepted successfully',
      acceptedOrder
    }
  })
}

exports.MakingOrderOutOfDelivery = async(req, res, next)=>{
  const {client_id, order_id} = req.body
  const findingUser = await SignUp.find({_id : client_id})
  findingUser[0].placed_orders.forEach(el=>{
    if(String(el._id)===String(order_id)){
      el.outForDelivery = 'out'
    }
  })

  findingUser[0].save()
  res.status(200).json({
    status : 'success',
    data : {
      message : 'Order out of delivery',
    }
  })
}