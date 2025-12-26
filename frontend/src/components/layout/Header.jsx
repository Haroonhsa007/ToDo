import { APP_NAME } from '../../constants';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
          <nav className="flex gap-6">
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
