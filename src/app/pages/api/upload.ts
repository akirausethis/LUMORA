import multer from 'multer';
import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

// Setup penyimpanan multer
const storage = multer.diskStorage({
  destination: './public/uploads', // simpan di folder public/uploads
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
 onError(error: Error, req: NextApiRequest, res: NextApiResponse) {
   res.status(501).json({ error: `Upload error: ${error.message}` });
 },
 onNoMatch(req: NextApiRequest, res: NextApiResponse) {
   res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
 },
});


apiRoute.use(upload.single('file')); // field name: file

apiRoute.post((req: any, res: NextApiResponse) => {
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
