/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'i.pinimg.com', // Untuk gambar Pinterest
            },
            {
                protocol: 'https', // Pastikan Picsum.photos menggunakan HTTPS
                hostname: 'picsum.photos', // Tambahkan domain ini
            },
            {
                protocol: 'http', // Jika Anda menggunakan localhost dengan HTTP
                hostname: 'localhost', // Untuk pengembangan lokal
            },
            // Anda bisa menambahkan domain Anda sendiri di sini jika dibutuhkan
            // {
            //   protocol: 'https',
            //   hostname: 'yourdomain.com', // Domain Anda sendiri
            // },
        ],
    },
};

export default nextConfig;