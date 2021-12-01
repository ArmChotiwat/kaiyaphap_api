const upload_image_store = async (
    data = {
        _branchid: new String(),
        _storeid : new String(),
        images: new Object(),
        parameter: new Object(),
        role: new Number(),
    },
    callback = (err = new Error) => { }) => {

    const tital = 'upload_image_store';
    const _ref_storeid = data.parameter.storeid;

    if (typeof data.images != 'object' || data.images == '',
        typeof data.parameter != 'object' || data.parameter == '',
        typeof data._branchid != 'string' || data._branchid == '' || data._branchid === null,
        typeof data._storeid != 'string' || data._storeid == '' || data._storeid === null,
        typeof data.role != 'number' || data.role == '' || data.role === null,
        typeof _ref_storeid != 'string' || _ref_storeid == '' || _ref_storeid === null

    ) { callback(new Error(`${tital} : uploadImageStore => data is Error`)); return; }

    else {
        const miscController = require('../../miscController');
        const mongodbController = require('../../mongodbController');
        const _storeid = await miscController.checkObjectId(_ref_storeid, (err) => { if (err) { callback(err); return; } });
        
        if (data._storeid !== data._branchid) {        
            callback(new Error(`Must be the main branch`))
            return;
        } else {
            const findproduct = await mongodbController.storeModel.findOne(
                {
                    '_id': _storeid,
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!findproduct) {
                callback(new Error(`fond _id in storeModel`));
                return;
            } else if (data.role !== 1) {
                callback(new Error(`Must be Admin only`));
                return;
            } else {
                const fileimage = data.images.file;
                const change_name_image = './media/upload/logo_' + _ref_storeid + '/' + _ref_storeid + '.png';
                const saveresel = await fileimage.mv(change_name_image).then(result => { return true; }).catch(err => { callback(err); return; });
                if (!saveresel || saveresel === null || saveresel === '') {
                    callback(new Error(`${tital} : uploadImageStore => canont move file to server`)); return;
                } else {
                    if (fileimage.mimetype === 'image/png' || fileimage.mimetype === 'image/jpeg' || fileimage.mimetype === 'image/bmp' || fileimage.mimetype === 'image/tiff' || fileimage.mimetype === 'image/gif') {
                        if (fileimage.size > 360000) {
                            let Jimp = require('jimp'); // ฟังชั้น resize 
                            /**
                             * ฟังชั้น อ่านไฟลรูป 
                             */
                            const image_jimp = async () => { // ฟังชั้น เรียกอ่านไฟลรูป 
                                try {
                                    const image = await Jimp.read(change_name_image);
                                    return image;
                                } catch (error) {
                                    return false;
                                }
                            };
                            /**
                             * ฟังชั้น resize รูป ในกรณี ที่รูปเป็นแนวนอน 
                             */
                            const image_resize = async (image) => {
                                try {
                                    await image.resize(600, Jimp.AUTO);// resize รูป ความยาว 600 ความสูง (Jimp.AUTO) ปรับอัตโนมัต 
                                    await image.quality(100); // คุณภาพของภาพ 1 - 100 ชัดสุด 100 
                                    await image.writeAsync(change_name_image); // เขียนไฟล์ทับไฟล์เดิม 
                                    return image;
                                } catch (error) {
                                    return false;
                                }
                            };
                            /**
                             * ฟังชั้น resize รูป ในกรณี ที่รูปเป็นแนวตั้ง  
                             * */
                            const image_resize_height = async (image) => {
                                try {
                                    await image.resize(Jimp.AUTO, 600);// resize รูป ความยาว(Jimp.AUTO) ปรับอัตโนมัต  ความสูง 600 
                                    await image.quality(100);// คุณภาพของภาพ 1 - 100 ชัดสุด 100 
                                    await image.writeAsync(change_name_image);// เขียนไฟล์ทับไฟล์เดิม 
                                    return image;
                                } catch (error) {
                                    return false;
                                }
                            };
                            const image_jimps = await image_jimp(); // อ่านไฟล์รูป 
                            let image_resizes;
                            if (image_jimps.bitmap.width > image_jimps.bitmap.height) { // ตรวจว่าเป็นแนวตั่งหรือแนวนอน ดูจาก ความยาว มากกว่า ความกว้าง 
                                image_resizes = await image_resize(image_jimps);
                            } else {
                                image_resizes = await image_resize_height(image_jimps);
                            }

                            if (!image_resizes || image_resizes === false) {

                                const fs = require("fs");
                                let removed_file;
                                try {
                                    fs.unlinkSync(change_name_image)
                                    removed_file = true;
                                } catch (error) {
                                    removed_file = false;
                                }

                                if (removed_file !== false || removed_file !== null || removed_file !== '' || !removed_file) {
                                    callback(new Error(`${tital} : uploadImageStore => canont save flies image`));
                                    return;
                                }
                                callback(new Error(`${tital} : uploadImageStore => canont removed file after Errer resize`));
                                return;
                            }
                        }

                        let i = 1;
                        while (i <= 10) {
                            let upload_mage_to_store = await mongodbController.storeModel.findOne(
                                {
                                    '_id': _storeid

                                }, (err) => { if (err) callback(err); return; }
                            );
                            upload_mage_to_store.image = '/' + _ref_storeid + '.png';
                            upload_mage_to_store = await upload_mage_to_store.save();
                            if (upload_mage_to_store !== null || upload_mage_to_store !== '' || !upload_mage_to_store) {
                                callback(null);
                                return upload_mage_to_store;
                            }
                            i++;
                        }
                    } else {
                        callback(new Error(`${tital} : uploadImageStore => UnSupported types file`));
                        return;
                    }
                }
            }
        }

    }
    callback(null);
    return;
};

const viewImageStore = async (data = { _storeid: new String(), _branchid: new String(''), }, callback = (err = new Error) => { }) => {
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null) { callback(new Error('viewImageStore => uploadImageStore_get: data._storeid must be String And not Empty')); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`viewImageStore : data._branchid must be String and Not Empty`)); return; }
    else {
        const miscController = require('../../miscController');
        const mongodbController = require('../../mongodbController');
        const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const getImageStore = await mongodbController.storeModel.aggregate(
            [
                {
                    '$match': {
                        '_id': _storeid
                    }
                }, {
                    '$unwind': {
                        'path': '$branch'
                    }
                }, {
                    '$match': {
                        'branch._id': _branchid
                    }
                }
            ],
            (errors) => {
                if (errors) { callback(errors); return; }
            }
        );
        if (getImageStore.length === 0) { callback(null); return; }
        else { callback(null); return { tax_id: getImageStore[0].address.tax_id, image: '/logo_' + data._storeid + getImageStore[0].image } }
    }
};

const viewImageStore_full_path = async (data = { _storeid: new String(), _branchid: new String(''), }, callback = (err = new Error) => { }) => {
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null) { callback(new Error('viewImageStore => uploadImageStore_get: data._storeid must be String And not Empty')); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`viewImageStore : data._branchid must be String and Not Empty`)); return; }
    else {
        let Jimp = require('jimp'); // ฟังชั้น resize 
        const miscController = require('../../miscController');
        const mongodbController = require('../../mongodbController');
        const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const getImageStore = await mongodbController.storeModel.aggregate(
            [
                {
                    '$match': {
                        '_id': _storeid
                    }
                }, {
                    '$unwind': {
                        'path': '$branch'
                    }
                }, {
                    '$match': {
                        'branch._id': _branchid
                    }
                }
            ],
            (errors) => {
                if (errors) { callback(null); return; }
            }
        );
        let image = await Jimp.read('./media/upload/logo_' + data._storeid + getImageStore[0].image);
        let buff = await image.getBufferAsync(Jimp.MIME_PNG)
        let base64data = buff.toString('base64');

        if (!getImageStore || getImageStore.length === 0) { callback(null); return { image: null }; }
        else { callback(null); return { image: base64data } }
    }
};

module.exports = { upload_image_store, viewImageStore, viewImageStore_full_path };