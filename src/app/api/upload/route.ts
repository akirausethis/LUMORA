// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, stat } from 'fs/promises'; // Menggunakan fs/promises untuk async/await
import path from 'path';
import mime from 'mime-types'; // Untuk deteksi tipe MIME yang lebih baik

// Anda mungkin perlu menginstal mime-types: npm install mime-types @types/mime-types
// Atau: yarn add mime-types @types/mime-types

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Fungsi untuk memastikan direktori upload ada
async function ensureUploadDirExists() {
  try {
    await stat(UPLOAD_DIR);
  } catch (e: any) {
    if (e.code === 'ENOENT') { // Jika direktori tidak ada
      try {
        await mkdir(UPLOAD_DIR, { recursive: true });
        console.log(`Created upload directory: ${UPLOAD_DIR}`);
      } catch (mkdirError) {
        console.error('Error creating upload directory:', mkdirError);
        throw mkdirError; // Lemparkan error jika pembuatan direktori gagal
      }
    } else {
      console.error('Error stating upload directory:', e);
      throw e; // Lemparkan error lain terkait stat direktori
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDirExists(); // Pastikan direktori ada sebelum proses upload

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah.' }, { status: 400 });
    }

    // Validasi tipe file (contoh: hanya gambar)
    const validBrowserMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const fileExtensionFromLib = mime.extension(file.type); 
    const fileMimeTypeFromName = mime.lookup(file.name) || ''; 

    let isValidMime = validBrowserMimeTypes.includes(file.type);
    if (!isValidMime && fileMimeTypeFromName) {
        isValidMime = validBrowserMimeTypes.includes(fileMimeTypeFromName)
    }
    if (!isValidMime && fileExtensionFromLib) {
        const mimeFromExt = mime.lookup(fileExtensionFromLib);
        if (mimeFromExt && validBrowserMimeTypes.includes(mimeFromExt)) {
            isValidMime = true;
        }
    }

    if (!isValidMime) {
      return NextResponse.json({ 
        error: `Tipe file tidak valid. Hanya JPEG, PNG, GIF, WebP yang diizinkan. Tipe terdeteksi: ${file.type}, dari nama: ${fileMimeTypeFromName}` 
      }, { status: 400 });
    }
    
    const MAX_FILE_SIZE_MB = 2;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.` }, { status: 413 });
    }

    // --- PERBAIKAN DI SINI ---
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer); // Gunakan Uint8Array
    // Node.js Buffer juga merupakan Uint8Array, jadi Buffer.from(arrayBuffer) juga seharusnya bekerja,
    // tapi menggunakan new Uint8Array() lebih eksplisit untuk tipe yang diharapkan writeFile.
    // const nodeBuffer = Buffer.from(arrayBuffer); // Alternatif jika Uint8Array masih bermasalah

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExt = path.extname(file.name) || (fileExtensionFromLib ? `.${fileExtensionFromLib}` : ''); 
    const originalNameBase = path.basename(file.name, path.extname(file.name));
    const safeOriginalNameBase = originalNameBase.replace(/[^a-zA-Z0-9_.-]/g, '_'); 
    const filename = `${safeOriginalNameBase}-${uniqueSuffix}${fileExt}`;
    
    const filePath = path.join(UPLOAD_DIR, filename);

    await writeFile(filePath, uint8Array); // Pass Uint8Array ke writeFile
    // await writeFile(filePath, nodeBuffer); // Jika menggunakan nodeBuffer
    // --- AKHIR PERBAIKAN ---

    console.log(`File uploaded successfully: ${filePath}`);

    return NextResponse.json({
      message: 'Upload sukses!',
      fileUrl: `/uploads/${filename}`, 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Upload error in API route (route.ts):', error);
    let errorMessage = 'Terjadi kesalahan saat mengunggah file.';
    if (error.message) {
        errorMessage = error.message;
    }
    if (error.code === 'EACCES') {
        errorMessage = 'Kesalahan izin: Tidak dapat menulis file ke direktori uploads.';
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}