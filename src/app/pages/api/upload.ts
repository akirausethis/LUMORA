import multer from 'multer';
import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
// 'path' tidak digunakan secara langsung di kode Anda, tapi mungkin oleh multer secara internal.
// Jika tidak ada error terkait path, Anda bisa membiarkannya atau menghapusnya.

// Setup penyimpanan multer
const storage = multer.diskStorage({
  destination: './public/uploads', // simpan di folder public/uploads
  filename: (req, file, cb) => { // req di sini akan di-infer sebagai Express.Request oleh multer
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error: Error, req: NextApiRequest, res: NextApiResponse) {
    console.error("Multer/NextConnect Error:", error); // Tambahkan logging untuk debug
    res.status(500).json({ error: `Upload error: ${error.message}` }); // Ubah ke 500 untuk error server umum
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// PERBAIKAN: Gunakan type assertion 'as any' di sini
apiRoute.use(upload.single('file') as any); // field name: file

apiRoute.post((req: NextApiRequest & { file?: Express.Multer.File }, res: NextApiResponse) => { // Perbaiki tipe req di sini
  // req.file akan ditambahkan oleh multer. Perlu ada definisinya di tipe req.
  if (!req.file) {
    return res.status(400).json({ error: "Tidak ada file yang diunggah atau file tidak valid." });
  }
  res.status(200).json({
    message: 'Upload sukses!',
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

export const config = {
  api: {
    bodyParser: false, // Harus false agar multer bisa bekerja
  },
};

export default apiRoute;