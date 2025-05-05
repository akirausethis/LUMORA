const LoginPage = () => {
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
            Belanja Online Lebih Cepat, Lebih Murah
          </p>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-1/2 flex items-center justify-center bg-white p-12">
        <div className="w-full max-w-xl space-y-6 p-10 rounded">
          {/* Tombol QR */}
          <div className="flex justify-end">
            <button className="bg-yellow-400 text-white font-bold px-4 py-1 rounded hover:bg-yellow-500 text-sm">
              Log in dengan QR 📱
            </button>
          </div>

          {/* Form Login */}
          <h2 className="text-2xl font-semibold">Log in</h2>
          <input
            type="text"
            placeholder="No. Handphone/Username/Email"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded"
          />

          <button className="w-full bg-[rgb(168,213,186)] text-white font-bold py-3 rounded hover:bg-green-300 transition">
            LOG IN
          </button>

          <div className="text-sm text-blue-600 hover:underline text-center cursor-pointer">
            Lupa Password
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">ATAU</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Login Sosial */}
          <div className="flex gap-4 justify-center">
            <button className="flex items-center gap-2 border p-2 px-4 rounded">
              <span>🔵</span> Facebook
            </button>
            <button className="flex items-center gap-2 border p-2 px-4 rounded">
              <span>🔴</span> Google
            </button>
          </div>

          <div className="text-sm text-center">
            Baru di Shopee?{' '}
            <span className="text-[rgb(168,213,186)] font-semibold cursor-pointer hover:underline">
              Daftar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage

