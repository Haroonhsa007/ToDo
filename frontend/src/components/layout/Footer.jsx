import { APP_NAME, APP_VERSION } from '../../constants';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-gray-600 text-sm">
          <p>
            {APP_NAME} v{APP_VERSION} - Built with React & Tailwind CSS
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
