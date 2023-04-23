import multer from "multer";
import path from "path";

// get the image file
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

// filter the file type to be only image
const fileFilter = (req, file, callback) => {
  const fileTypes = /jpg|JPG|jpeg|JPEG|png|PNG/;
  const mime_type = fileTypes.test(file.mimeType);
  const extname = fileTypes.test(path.extname(file.originalname));
  if (mime_type && extname) {
    return callback(null, true);
  } else {
    return callback(new Error("This image format type is not allowed"), false);
  }
};

// upload the image
export const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
}).single("image");
