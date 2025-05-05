import Link from 'next/link';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Kiri */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-[rgb(168,213,186)] text-white px-8">
        <div className="text-center">
          <div className="text-8xl mb-4">🛍️</div>
          <h1 className="text-5xl font-bold mb-4">Shopee</h1>
          <p className="text-lg">
            Selamat Datang di <span className="font-semibold">Shopee</span>
            <br />
            Buat Akun untuk Belanja Lebih Mudah
          </p>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-1/2 flex items-center justify-center bg-white p-12">
        <div className="w-full max-w-xl space-y-6  p-10 rounded">
          <h2 className="text-2xl font-semibold">Register</h2>

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded"
          />

          <button className="w-full bg-[rgb(168,213,186)] text-white font-bold py-3 rounded hover:bg-green-300 transition">
            REGISTER
          </button>

          <div className="text-sm text-center">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="text-[rgb(168,213,186)] font-semibold hover:underline"
            >
              Log in
            </Link>
          </div>

          <div className="text-xs text-gray-400 text-center">
            Kamu akan terdaftar sebagai <strong>buyer</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;