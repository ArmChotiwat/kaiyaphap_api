const casePatinetCreateCaseStage2ImageController = async (
    data = {
        _storeid: new String(''),
        _casepatientid: new String(''),
        file: new Object()
    },
    callback = (err = new Err) => { }
) => {
    if (typeof data !== 'object' ||
        typeof data._casepatientid !== 'string' || data._casepatientid === '' || !data._casepatientid ||
        typeof data._storeid !== 'string' || data._storeid === '' || !data._storeid ||
        typeof data.file !== 'object' || data.file === '' || !data.file
    ) {
        return [];
    } else {
        const miscController = require('../../miscController');
        const mongodbController = require('../../mongodbController');
        let Jimp = require('jimp');
        const image_jimp = async (change_name_image) => {
            try {
                const image = await Jimp.read(change_name_image);
                return image;
            } catch (error) {
                return false;
            }
        };
        const image_resize = async (image, change_name_image) => {
            try {
                await image.resize(1280, Jimp.AUTO);
                await image.quality(100);
                await image.writeAsync(change_name_image);
                return image;
            } catch (error) {
                return false;
            }
        };
        const image_resize_height = async (image, change_name_image) => {
            try {
                await image.resize(Jimp.AUTO, 1280);
                await image.quality(100);
                await image.writeAsync(change_name_image);
                return image;
            } catch (error) {
                return false;
            }
        };
        const image_removed_file = async (change_name_image) => {
            const fs = require("fs");
            try {
                fs.unlinkSync(change_name_image)
                return true;
            } catch (error) {
                return false;
            }
        };
        const _casepatientid = await miscController.checkObjectId(data._casepatientid, (err) => { if (err) { callback(err); return; } });
        let findcasepatinet = await mongodbController.casePatientStage2Model.findOne(
            {
                '_ref_casepatinetid': _casepatientid,
            },
            (err) => { if (err) { callback(err); return; } }
        );
        const fileimage = data.file;

        if (!fileimage.file.length) {
            const change_name_image = './media/upload/stage2image/' + data._storeid + '/' + data._casepatientid + '/' + data._casepatientid + '.jpg';
            const saveresel = await fileimage.file.mv(change_name_image).then(result => { return true; }).catch(err => { callback(err); return; });
            if (fileimage.file.mimetype === 'image/png' || fileimage.file.mimetype === 'image/jpeg' || fileimage.file.mimetype === 'image/bmp' || fileimage.file.mimetype === 'image/tiff' || fileimage.file.mimetype === 'image/gif') {
                if (!saveresel || saveresel === null || saveresel === '') {
                    callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont move file to server`)); return;
                } else {

                    if (fileimage.file.size > 600000) {
                        const image_jimps = await image_jimp(change_name_image);
                        let image_resizes;
                        if (image_jimps.bitmap.width > image_jimps.bitmap.height) {
                            image_resizes = await image_resize(image_jimps, change_name_image);
                        } else {
                            image_resizes = await image_resize_height(image_jimps, change_name_image);
                        }
                        if (!image_resizes || image_resizes === false || image_resizes === '') {
                            const removed_file = await image_removed_file(change_name_image);
                            if (removed_file !== false || !removed_file) {
                                callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont save flies image`));
                                return;
                            }
                            callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont removed file after Errer resize`));
                            return;
                        }
                    }

                    let i = 1;
                    while (i <= 10) {
                        i++;
                        if (findcasepatinet.stage2data !== null) {
                            const findcasepatinets = await mongodbController.casePatientStage2Model.findByIdAndUpdate(
                                {
                                    '_id': findcasepatinet._id,
                                    '_ref_casepatinetid': _casepatientid
                                },
                                {
                                    'stage2data.inputfile_image': [{ name: '/' + data._casepatientid + '.jpg' }]
                                },
                                (errors) => {
                                    if (errors) { return; }
                                }
                            );
                            if (!findcasepatinets) {
                                callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => seve file fall casepatientid : ${String(_casepatientid)}`));
                                return;
                            } else {
                                callback(null);
                                return findcasepatinets;
                            }
                        } else if (findcasepatinet.stage2data_neuro !== null) {
                            const findcasepatinets = await mongodbController.casePatientStage2Model.findByIdAndUpdate(
                                {
                                    '_id': findcasepatinet._id,
                                    '_ref_casepatinetid': _casepatientid
                                },
                                {
                                    'stage2data_neuro.inputfile_image': [{ name: '/' + data._casepatientid + '.jpg' }]

                                },
                                (errors) => {
                                    if (errors) { return; }
                                }
                            );
                            if (!findcasepatinets) {
                                callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => seve file fall casepatientid : ${String(_casepatientid)}`));
                                return;
                            } else {
                                callback(null);
                                return findcasepatinets;
                            }
                        } else {
                            callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont find data for save image`));
                            return;
                        }

                    }
                }
            } else {
                callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => not Support types file : ${fileimage.file.mimetype}`));
                return;
            }
        } else {
            let mapData = [];
            for (let index = 0, length = fileimage.file.length; index < length; index++) {
                //const extensions = "." + (fileimage.file[index].name.split("."))[fileimage.file[index].name.split(".").length - 1]
                const change_name_image = './media/upload/stage2image/' + data._storeid + '/' + data._casepatientid + '/' + data._casepatientid + '_' + index + '.jpg';
                const saveresel = await fileimage.file[index].mv(change_name_image).then(result => { return true; }).catch(err => { callback(err); return; });
                if (fileimage.file[index].mimetype === 'image/png' || fileimage.file[index].mimetype === 'image/jpeg' || fileimage.file[index].mimetype === 'image/bmp' || fileimage.file[index].mimetype === 'image/tiff' || fileimage.file[index].mimetype === 'image/gif') {
                    if (!saveresel || saveresel === null || saveresel === '') {
                        callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont move file to server`)); return;
                    } else {
                        if (fileimage.file[index].size > 600000) {
                            const image_jimps = await image_jimp(change_name_image);
                            let image_resizes;
                            if (image_jimps.bitmap.width > image_jimps.bitmap.height) {
                                image_resizes = await image_resize(image_jimps, change_name_image);
                            } else {
                                image_resizes = await image_resize_height(image_jimps, change_name_image);
                            }

                            if (!image_resizes || image_resizes === false) {

                                const removed_file = await image_removed_file(change_name_image);
                                if (removed_file !== false || !removed_file) {
                                    callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont save flies image`));
                                    return;
                                }
                                callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont removed file after Errer resize`));
                                return;
                            } else {
                                mapData.push({ name: '/' + data._casepatientid + '_' + index + '.jpg' });
                            }
                        } else {
                            mapData.push({ name: '/' + data._casepatientid + '_' + index + '.jpg' });
                        }
                    }
                } else {
                    callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => not Support types file : ${fileimage.file.mimetype}`));
                    return;
                }
            }

            if (findcasepatinet.stage2data !== null) {
                const findcasepatinets = await mongodbController.casePatientStage2Model.findByIdAndUpdate(
                    {
                        '_id': findcasepatinet._id,
                        '_ref_casepatinetid': _casepatientid
                    },
                    {
                        'stage2data.inputfile_image': mapData
                    },
                    (errors) => {
                        if (errors) { return; }
                    }
                );
                if (!findcasepatinets) {
                    callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => seve file fall casepatientid : ${String(_casepatientid)}`));
                    return;
                } else {
                    callback(null);
                    return findcasepatinets;
                }
            } else if (findcasepatinet.stage2data_neuro !== null) {
                const findcasepatinets = await mongodbController.casePatientStage2Model.findByIdAndUpdate(
                    {
                        '_id': findcasepatinet._id,
                        '_ref_casepatinetid': _casepatientid
                    },
                    {
                        'stage2data_neuro.inputfile_image': mapData

                    },
                    (errors) => {
                        if (errors) { return; }
                    }
                );
                if (!findcasepatinets) {
                    callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => seve file fall casepatientid : ${String(_casepatientid)}`));
                    return;
                } else {
                    callback(null);
                    return findcasepatinets;
                }
            } else {
                callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont find data for save image`));
                return;
            }

        }
        callback(new Error(`${tital} : casePatinetCreateCaseStage2ImageController => canont save flies image`));
        return;
    }
};
module.exports = casePatinetCreateCaseStage2ImageController;