/**
 * Middleware สำหรับ สร้าง ใบสินค้านำเข้า แล้วนำเข้าจำนวนสินค้าไปยังสินค้าคงคลัง
 */
const productInventoryImport_Save_Middileware = (req, res, next) => {
    const miscController = require('../../../Controller/miscController');
    const validateObjectId = miscController.validateObjectId;
    const validateDateTime_String = miscController.validateDateTime.validateDateTime_String;
    const validate_StringOrNull_AndNotEmpty = miscController.validate_StringOrNull_AndNotEmpty;

    /**
     ** JSON => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                    "import_date_string": { type: DateString }, // วันที่นำเข้าสินค้า
                    "import_time_string": { type: TimeString }, // เวลาที่นำเข้าสินค้า
                    "_ref_agentid_import": { type: StringObjectId }, // _agentid ผู้จัดซื้อ-นำเข้าสินค้า
                    "run_number_inventoryimport_customize": { type: String }, // เลขที่เองสารกำหนดเอง โดย User
                    "run_number_inventoryimport_ref": { type: String }, // เลขที่เอกสารอ้างอิง โดย User
                    "product": [
                        {
                            "_ref_productid": { type: StringObjectId }, // ObjectId ระเบียนสินค้า
                            "inventoryimport_count": { type: Number morethan or equal 0 }, // จำนวนสินค้านำเข้า
                            "inventoryimport_price": { type: Number morethan or equal 0 } // ราคาสินค้านำเข้า (ราคาที่ซื้อมา)
                        }
                    ]
                }
    */
    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (!validateObjectId(payload._storeid)) { ErrorJson.description.push(`KEY <_storeid> must be String ObjectId`); }
    if (!validateObjectId(payload._branchid)) { ErrorJson.description.push(`KEY <_branchid> must be String ObjectId`); }
    if (!validateDateTime_String(payload.import_date_string, payload.import_time_string)) { ErrorJson.description.push(`KEY <import_date_string> and KEY <import_time_string> must be String Date and Time <YYYY-MM-DD> and <HH:mm:ss>`); }
    if (!validateObjectId(payload._ref_agentid_import)) { ErrorJson.description.push(`KEY <_ref_agentid_import> must be String ObjectId`); }
    if (!validate_StringOrNull_AndNotEmpty(payload.run_number_inventoryimport_customize)) { ErrorJson.description.push(`KEY <run_number_inventoryimport_customize> must be String or Null and Not Empty`); }
    if (!validate_StringOrNull_AndNotEmpty(payload.run_number_inventoryimport_ref)) { ErrorJson.description.push(`KEY <run_number_inventoryimport_ref> must be String or Null and Not Empty`); }
    if (typeof payload.product != 'object') { ErrorJson.description.push(`KEY <product> must be Array and Length morethan 0`); }
    else if (payload.product.length < 1) { ErrorJson.description.push(`KEY <product> Length of Array must be morethan 0`); }
    else {
        for (let index = 0; index < payload.product.length; index++) {
            const element = payload.product[index];
            
            if (!validateObjectId(element._ref_productid)) { ErrorJson.description.push(`KEY <payload.product.[${index}]._ref_productid> must be String ObjectId`); }
            if (typeof element.inventoryimport_count != 'number' || element.inventoryimport_count < 0) { ErrorJson.description.push(`KEY <payload.product.[${index}].inventoryimport_count> must be Number morethan or equal 0`); }
            if (typeof element.inventoryimport_price != 'number' || element.inventoryimport_price < 0) { ErrorJson.description.push(`KEY <payload.product.[${index}].inventoryimport_price> must be Number morethan or equal 0`); }
        }
    }

    if (ErrorJson.description.length != 0) {
        res.status(400).json(ErrorJson).end();
    } else {
        next();
    }
};

module.exports = productInventoryImport_Save_Middileware;