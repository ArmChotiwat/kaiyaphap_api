/**
 * misc Controller สำหรับตรวจ ขนาดของ Directory (รวมของข้างใน Directory ด้วย)
 */
const checkDirectorySize = async (dir_path = '', callback = (err = new Error) => { }) => {
    if (!dir_path) { dir_path = __dirname; }

    const getSize = require('get-folder-size');

    const promise_CheckDirectorySize = new Promise((resolutionFunc, rejectionFunc) => {
        try {
            getSize(
                dir_path, (err, size) => {
                    if (err) { rejectionFunc(err); return; }
                    else {
                        // console.log(size + ' bytes');
                        // console.log((size / 1024 / 1024).toFixed(2) + ' MB');
                        resolutionFunc({ directory_path: dir_path, size});
                        return;
                    }
                }
            )
        } catch (error) {
            rejectionFunc(error);
            return;
        }
    });

    try {
        const directorySize = await promise_CheckDirectorySize.then(result => result).catch(err => { throw err; });

        callback(null);
        return {
            directory_path: String(directorySize.directory_path),
            bytes: Number(directorySize.size),
            mega_bytes: Number((directorySize.size / 1024 / 1024).toFixed(2))
        };

    } catch (error) {
        callback(error);
        return;
    }
};

module.exports = checkDirectorySize;