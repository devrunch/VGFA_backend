import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client,ListObjectsV2Command,DeleteObjectsCommand} from  "@aws-sdk/client-s3";
import path from 'path';

// Configure AWS SDK
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const deleteExistingFiles = async (phone, field) => {
  const listParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: `official/${phone}-${field}-`,
  };

  try {
    const listCommand = new ListObjectsV2Command(listParams);
    const listedObjects = await s3.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
      },
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3.send(deleteCommand);
  } catch (err) {
    console.error('Error deleting files:', err);
    throw new Error('Error deleting existing files');
  }
};
const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: async (req, file, cb) => {
    const phone = req.body.phone;
    const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const field = file.fieldname;
    const filename = `official/${phone}-${field}-${randomNumbers}${fileExtension}`;
    await deleteExistingFiles(phone, field);
    cb(null, filename);
  },
  acl: 'public-read', // Adjust according to your needs
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
  { name: 'profilePicture', maxCount: 1 }
]);

export default upload;
