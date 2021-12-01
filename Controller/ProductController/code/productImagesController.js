const { ObjectId } = require('mongodb');

const product_Images_Controller = async (
    data = {
        images: new Object(),
        parameter: new Object(),
    },
    callback = (err = new Error) => { }) => {

    const tital = 'Treatment_Controller';    
    const _ref_storeid = data.parameter.storeid;
    const _ref_productid= data.parameter.productid;

    if (typeof data.images != 'object' || data.images == '',
        typeof data.parameter != 'object' || data.parameter == '',        
        typeof _ref_storeid != 'string' || _ref_storeid == '' || _ref_storeid == null ||
        typeof _ref_productid != 'string' || _ref_productid == '' || _ref_productid == null
    ) { callback(new Error(`${tital} : data is Error`)); return; }
    else {

        const testJSON = (text) => {
            try {
                var test = JSON.parse(text);
                return (test);
            } catch (error) {
                return null;
            }
        }
        // const regx_parameter = testJSON(data.parameter.test);
        // console.log(regx_parameter[0].replaceflie);

        const miscController = require('../../miscController');
        const mongodbController = require('../../mongodbController');
        const productModel = mongodbController.productModel
        const productImagesModel = mongodbController.productImagesModel;
        let last_number_productImages;
        let numberStart;
        let change_name_image;
        let extensions = [];
        let find_number_productImages = [];
        
        const _storeid = await miscController.checkObjectId(_ref_storeid, (err) => { if (err) { callback(err); return; } });
        const _productid = await miscController.checkObjectId(_ref_productid, (err) => { if (err) { callback(err); return; } });
        

        const findproduct = await productModel.findOne(
            {
                '_id': _productid,
                '_ref_storeid': _storeid,
            },
            (err) => { if (err) { callback(err); return; } }
        );

        
        const fileimagename = await mongodbController.productImagesModel.find(
            {                
                '_ref_storeid': _storeid,
            }
        );

        if (!fileimagename) {
            last_number_productImages = 0;
        } else {
            for (let i = 0; i < fileimagename.length; i++) {
                find_number_productImages.push(fileimagename[i].count_images)
            }
            find_number_productImages.sort()
            last_number_productImages = find_number_productImages.slice(-1)
        }

        if (!findproduct) {
            callback(new Error(`cannot find _id and _ref_storeid in productMondel`))
        } else {
            const fileimage = data.images.file;
            const moment = require('moment');
            const create_date = moment();
            const create_date_string = create_date.format('YYYY-MM-DD');
            const create_time_string = create_date.format('HH:mm:ss');

            if (!fileimage.length) {
                numberStart = +last_number_productImages[0] + 1;
                extensions = "." + (fileimage.name.split("."))[fileimage.name.split(".").length - 1]
                change_name_image = _ref_productid + '_' + numberStart + extensions;
                const saveresel = await fileimage.mv(
                    './media/product' + _ref_productid + '/' + change_name_image,
                ).then(result => { return true; }
                ).catch(
                    err => {
                        callback(err);
                        return;
                    }
                );
                if (!saveresel) {
                    callback(new Error(`canont move file to server`)); return;
                }
                let mapData;
                try {
                    mapData = {
                        create_date: create_date,
                        create_date_string: create_date_string,
                        create_time_string: create_time_string,                        
                        _ref_storeid: _storeid,
                        find_number_productImages: numberStart,
                        images: change_name_image
                    }
                } catch (error) {
                    callback(error);
                    return;
                }
                if (mapData) {
                    const productImageModelsave = new productImagesModel(mapData);
                    const transactionSave = await productImageModelsave.save().then(result => { return result; }).catch(err => { callback(err); return; });
                    if (!transactionSave) {
                        callback(new Error(`ProductSavePriceController : can't save mapproductSavePriccontroller`));
                        return;
                    }
                }

            } else {
                numberStart = 1 + +last_number_productImages;
                for (let i = 0, length = fileimage.length; i < length; i++) {
                    extensions[i] = "." + (fileimage[i].name.split("."))[fileimage[i].name.split(".").length - 1]
                    const count = numberStart + i;
                    change_name_image = _ref_productid + '_' + count + extensions[i];

                    const saveresel = await fileimage[i].mv(
                        './media/product/' + _ref_productid + '/' + change_name_image
                    ).then(result => { return true; }
                    ).catch(err => { callback(err); return; });

                    if (!saveresel) { callback(new Error(`canont move file to server`)); return; }
                    let mapData;
                    try {
                        mapData = {

                            create_date: create_date,
                            create_date_string: create_date_string,
                            create_time_string: create_time_string,
                            
                            _ref_storeid: _storeid,

                            find_number_productImages: count,

                            images: change_name_image

                        }
                    } catch (error) { callback(error); return; }
                    if (mapData) {
                        const productImageModelsave = new productImagesModel(mapData);
                        const transactionSave = await productImageModelsave.save().then(result => { return result; }).catch(err => { callback(err); return; });
                        if (!transactionSave) {
                            callback(new Error(`ProductSavePriceController : can't save mapproductSavePriccontroller`));
                            return;
                        }
                    }

                }

            }

            callback(null);
            return;

        }




    }
};
module.exports = product_Images_Controller;