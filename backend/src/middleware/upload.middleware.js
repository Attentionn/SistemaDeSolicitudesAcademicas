const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Organizar por carpeta de usuario
    const userId = req.user?.userId || 'unknown';
    const uploadPath = path.join(__dirname, '../../uploads/evidencias', userId.toString());
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único con timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'evidencia-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos - solo PDF y PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF o PNG'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
});

module.exports = upload;
