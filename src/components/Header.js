import { Bell, Calendar, GraduationCap, MapPin, Phone } from 'lucide-react';
import config from '../config/appConfig';

const Header = ({ onBellClick, onReset }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button onClick={onReset} className="flex items-center hover:opacity-80 transition-opacity text-left">
                <div className="bg-primary-600 rounded-xl p-2">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mobile-header-title">
                    {config.school.name}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 flex items-center mobile-header-subtitle">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Academic Calendar • Academic Year{' '}
                    {config.school.academicYear}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                <span>Madhavaram, Chennai</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <Phone className="h-4 w-4 mr-2 text-primary-600" />
                <span>+91 97911 91397</span>
              </div>
              <button
                onClick={onBellClick}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                title="Notification settings"
              >
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile details row */}
        <div className="lg:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-primary-600" />
              <span>Madhavaram, Chennai</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
