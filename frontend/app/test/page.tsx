export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Test Page - No JavaScript
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Nếu trang này không nhấp nháy, vấn đề là ở các component React có useEffect hoặc SessionProvider.
        </p>
        <div className="space-y-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors">
            Button 1 - Should be clickable
          </button>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors">
            Button 2 - Should be clickable
          </button>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors">
            Button 3 - Should be clickable
          </button>
        </div>
      </div>
    </div>
  )
}
