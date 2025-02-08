import Link from "next/link"

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Welcome to StockAI</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/documents"
          className="no-underline"
        >
          <div className="p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-3">Company Documents</h2>
            <p className="text-gray-600">Upload and manage your important company documents</p>
          </div>
        </Link>
        <Link 
          href="/cap-tables"
          className="no-underline"
        >
          <div className="p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-3">Cap Table Management</h2>
            <p className="text-gray-600">Track and manage your cap table with ease</p>
          </div>
        </Link>
      </div>
    </div>
  )
}