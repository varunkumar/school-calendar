import { BarChart3, Bell, Calendar, Download, MapPin, Phone } from 'lucide-react';
import config from '../config/appConfig';

const Header = ({ onBellClick, onReset, showDashboard, onDashboardToggle, onExport }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">

          {/* Logo + Title — min-w-0 allows it to shrink and truncate */}
          <button
            onClick={onReset}
            className="flex items-center min-w-0 flex-1 hover:opacity-80 transition-opacity text-left"
          >
            <img
              src="/logo-school.png"
              alt="School logo"
              className="h-10 sm:h-14 w-auto object-contain flex-shrink-0"
            />
            <div className="ml-2 sm:ml-3 min-w-0">
              <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900 leading-tight truncate">
                {config.school.name}
              </h1>
              <p className="text-xs text-gray-500 flex items-center mt-0.5">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">AY {config.school.academicYear}</span>
              </p>
            </div>
          </button>

          {/* Right actions — flex-shrink-0 so they never compress */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            {/* Desktop: location + phone */}
            <div className="hidden lg:flex items-center gap-3 mr-2">
              <span className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1 text-primary-500" />
                Madhavaram, Chennai
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <Phone className="h-4 w-4 mr-1 text-primary-500" />
                +91 97911 91397
              </span>
            </div>

            {/* Dashboard toggle — icon only on mobile */}
            <button
              onClick={onDashboardToggle}
              title="Toggle dashboard"
              className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                showDashboard
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-4 w-4 flex-shrink-0" />
              <span className="hidden md:inline text-sm">Dashboard</span>
            </button>

            {/* Export — icon only on mobile */}
            <button
              onClick={onExport}
              title="Export calendar"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="hidden md:inline text-sm">Export</span>
            </button>

            {/* Bell */}
            <button
              onClick={onBellClick}
              title="Notification settings"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
