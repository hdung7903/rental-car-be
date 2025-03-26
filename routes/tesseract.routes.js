import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";

const router = express.Router();

// Cấu hình Multer (Sử dụng field "file" thay vì "image" để đồng bộ với FE)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Chỉ hỗ trợ ảnh JPG, PNG"));
    }
    cb(null, true);
  },
});

// Danh sách từ khóa nhận dạng bằng lái xe
const drivingLicensePatterns = [
  /GIẤY PHÉP LÁI XE/i,
  /BẰNG LÁI/i,
  /GPLX/i,
  /DRIVER\S*\sLICENSE/i,
];

// Chuẩn hóa văn bản OCR để tránh lỗi nhận dạng
const normalizeText = (text) => {
  return text
    .toUpperCase()
    .replace(/[^\p{L}\p{N}\s\/]/gu, "") // Xóa ký tự đặc biệt
    .replace(/\s+/g, " ") // Xóa khoảng trắng dư thừa
    .replace(/LÁIXE/g, "LÁI XE") // Sửa lỗi OCR thường gặp
    .trim();
};

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không có tệp tin nào được tải lên" });
  }

  try {
    const { data } = await Tesseract.recognize(req.file.buffer, "vie", {
      logger: (m) => console.log(m), // Log quá trình OCR
    });

    const extractedText = normalizeText(data.text);

    // Kiểm tra từ khóa bằng biểu thức chính quy
    const isDrivingLicense = drivingLicensePatterns.some((pattern) =>
      pattern.test(extractedText)
    );

    if (!isDrivingLicense) {
      return res.status(400).json({
        error: "Ảnh không phải bằng lái xe",
        extractedText,
      });
    }

    return res.status(200).json({
      message: "Xác nhận đây là bằng lái xe",
      extractedText,
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi xử lý OCR", details: error.message });
  }
});

// Bắt lỗi Multer để tránh status 200 với body lỗi
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

export default router;
