const multer = require("multer");
// dependency multer
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "/uploads"));
    },
    // konfigurasi penamaan file yang unik
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
});

const customMulter = multer({storage: diskStorage});

module.exports = customMulter;