const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads');
    }, filename: (req, file, callBack) => {
        callBack(null, `Image-${Date.now()}-${file.originalname}`);
    }
});
const fileFilter = (req, file, callBack) => {
    if (file.mimetype.startsWith('image/')) {
        
        callBack(null, true);
        
    } else {
        callBack(null, false);

        }
    }

const multerMiddleware = multer({ storage, fileFilter })
module.exports = multerMiddleware;