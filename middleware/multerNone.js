import multer from "multer";

/**
 * Parse multipart form data with multer that does not contain any files
 */
const parseFormData = multer().none();

export default parseFormData;