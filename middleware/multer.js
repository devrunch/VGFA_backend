import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Function to delete existing file if it exists
const deleteExistingFile = (directory, filename) => {
  const filePath = path.join(directory, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const phone = req.body.phone;
    const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const field = file.fieldname;
    const filename = `${phone}-${field}-${randomNumbers}${fileExtension}`;

    const existingFiles = fs.readdirSync('./uploads/').filter(f => f.includes(`${phone}-${field}-`));
    existingFiles.forEach(existingFile => deleteExistingFile('./uploads/', existingFile));


    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedProfilePictureTypes = /jpeg|jpg|png/;
  const allowedDocumentTypes = /docx|pdf|jpeg|jpg|png/;
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'profilePicture') {
    if (allowedProfilePictureTypes.test(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Profile picture file type not allowed'), false);
    }
  } else if (['LandOwnership', 'CropHarvestRecords', 'Certification', 'SoilHealthReport', 'FarmPhotos'].includes(file.fieldname)) {
    if (allowedDocumentTypes.test(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Document file type not allowed'), false);
    }
  } else {
    cb(new Error('Unknown field'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 200000000 },
  fileFilter: fileFilter,
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'LandOwnership', maxCount: 1 },
  { name: 'CropHarvestRecords', maxCount: 1 },
  { name: 'Certification', maxCount: 1 },
  { name: 'SoilHealthReport', maxCount: 1 },
  { name: 'FarmPhotos', maxCount: 5 },
]);

export default upload;
