const product_Save_Middleware = require('./code/product_Save_Middleware');
const product_Edit_Middleware = require('./code/product_Edit_Middleware');
const productInventory_Switch_Middleware = require('./code/productInventory_Switch_Middleware');
const productInventory_StoreBranch_View_All_Middleware = require('./code/productInventory_StoreBranch_View_All_Middleware');
const productInventoryImport_Save_Middileware = require('./code/productInventoryImport_Save_Middleware');
const productInventoryPrice_Save_Middleware = require('./code/productInventoryPrice_Save_Middleware');
const productInventoryImport_View_Agent_Middleware = require('./code/productInventoryImport_View_Agent_Middleware');

module.exports = {
    product_Save_Middleware,
    product_Edit_Middleware,
    productInventory_Switch_Middleware,
    productInventory_StoreBranch_View_All_Middleware,
    productInventoryImport_Save_Middileware,
    productInventoryPrice_Save_Middleware,
    productInventoryImport_View_Agent_Middleware,
}