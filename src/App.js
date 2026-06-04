import {
  BarChart3,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  Download,
  GraduationCap,
  Grid,
  Home,
  List,
  Plane,
  Search,
  Users,
  Zap,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Dashboard from './components/Dashboard';
import EventList from './components/EventList';
import EventModal from './components/EventModal';
import Header from './components/Header';
import MobileAgenda from './components/MobileAgenda';
import NotificationSettings from './components/NotificationSettings';
import SearchModal from './components/SearchModal';
import SectionsView from './components/SectionsView';
import TimingsView from './components/TimingsView';
import { allCalendarEvents } from './data/realCalendarData';
import { useNotifications } from './hooks/useNotifications';
import {
  initGA,
  trackCalendarInteraction,
  trackDashboardView,
  trackEventView,
  trackExportAction,
  trackFilterUsage,
  trackPageView,
  trackViewModeChange,
} from './utils/analytics';

const localizer = momentLocalizer(moment);

const getDomainDefaultClass = () => {
  const hostname = window.location.hostname;
  if (hostname === 'calendar.aganvee.in') return 'I';
  if (hostname === 'calendar.adhiyan.in') return 'VI';
  return 'all';
};

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [events] = useState(allCalendarEvents);
  const { prefs, updatePrefs, permissionStatus, requestPermission } = useNotifications(events);
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const [activeFilter, setActiveFilter] = useState(
    () => localStorage.getItem('cal_activeFilter') || 'all'
  );
  const [activeClass, setActiveClass] = useState(() => {
    return localStorage.getItem('cal_activeClass') || getDomainDefaultClass();
  });
  const [showSearch, setShowSearch] = useState(false);
  const [showDashboard, setShowDashboard] = useState(
    () => localStorage.getItem('cal_showDashboard') !== 'false'
  );
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem('cal_viewMode') || 'calendar'
  );

  useEffect(() => {
    initGA();
    trackPageView();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('cal_activeFilter', activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    localStorage.setItem('cal_viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('cal_showDashboard', String(showDashboard));
  }, [showDashboard]);

  useEffect(() => {
    localStorage.setItem('cal_activeClass', activeClass);
  }, [activeClass]);

  // Filter events based on active filter and class
  const filteredEvents = useMemo(() => {
    let filtered = events.map((event) => ({
      ...event,
      start: event.date,
      end: event.endDate || event.date,
    }));

    if (activeFilter !== 'all') {
      filtered = filtered.filter((event) => event.category === activeFilter);
    }

    if (activeClass !== 'all') {
      filtered = filtered.filter((event) =>
        !event.classRange ||
        event.classRange.length === 0 ||
        event.classRange.includes(activeClass)
      );
    }

    return filtered;
  }, [events, activeFilter, activeClass]);

  // Custom event style getter
  const eventStyleGetter = (event) => {
    const colors = {
      academic: '#3b82f6',
      exam:     '#8b5cf6',
      activity: '#06b6d4',
      holiday:  '#ef4444',
      vacation: '#f59e0b',
      fee:      '#dc2626',
      ptm:      '#7c3aed',
    };
    return {
      style: {
        backgroundColor: colors[event.category] || '#6b7280',
        borderRadius: '4px', opacity: 0.8, color: 'white', border: '0px', display: 'block',
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    trackEventView(event.title, event.category);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleReset = () => {
    setActiveFilter('all');
    setViewMode('calendar');
    setShowDashboard(true);
    setActiveClass(getDomainDefaultClass());
    localStorage.removeItem('cal_activeFilter');
    localStorage.removeItem('cal_viewMode');
    localStorage.removeItem('cal_showDashboard');
    localStorage.removeItem('cal_activeClass');
  };

  const exportToICS = () => {
    // Simple ICS export functionality
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:School Calendar\n';

    filteredEvents.forEach((event) => {
      const startDate = moment(event.start).format('YYYYMMDD');
      const endDate = moment(event.end).format('YYYYMMDD');

      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `DTSTART:${startDate}\n`;
      icsContent += `DTEND:${endDate}\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      if (event.description) {
        icsContent += `DESCRIPTION:${event.description}\n`;
      }
      if (event.classes) {
        icsContent += `LOCATION:${event.classes}\n`;
      }
      icsContent += `END:VEVENT\n`;
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'school-calendar.ics';
    link.click();
    URL.revokeObjectURL(url);

    trackExportAction();
  };

  const filterButtons = [
    { key: 'all',      label: 'All',        icon: CalendarIcon,  color: 'bg-gray-500' },
    { key: 'academic', label: 'Academic',   icon: BookOpen,      color: 'bg-blue-500' },
    { key: 'exam',     label: 'Exams',      icon: GraduationCap, color: 'bg-violet-500' },
    { key: 'activity', label: 'Activities', icon: Zap,           color: 'bg-cyan-500' },
    { key: 'holiday',  label: 'Holidays',   icon: Home,          color: 'bg-red-500' },
    { key: 'vacation', label: 'Vacation',   icon: Plane,         color: 'bg-amber-500' },
    { key: 'fee',      label: 'Fee',        icon: CreditCard,    color: 'bg-red-600' },
    { key: 'ptm',      label: 'PTM',        icon: Users,         color: 'bg-violet-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBellClick={() => setShowNotifSettings(true)} onReset={handleReset} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Bar */}
        <div className="mb-6 md:mb-8 space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center justify-between">
            <button
              onClick={() => setShowSearch(true)}
              className="relative flex items-center w-full max-w-md px-4 py-2 md:py-2.5 text-sm text-gray-400 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <Search className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Search events…</span>
              <span className="ml-auto text-xs bg-gray-100 px-1.5 py-0.5 rounded">⌘K</span>
            </button>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              <div className="flex bg-gray-100 rounded-lg p-1 flex-shrink-0">
                <button
                  onClick={() => {
                    setViewMode('calendar');
                    trackViewModeChange('calendar');
                  }}
                  className={`flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    viewMode === 'calendar'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid size={14} className="mr-1" />
                  Calendar
                </button>
                <button
                  onClick={() => {
                    setViewMode('sections');
                    trackViewModeChange('sections');
                  }}
                  className={`flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    viewMode === 'sections'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={14} className="mr-1" />
                  Sections
                </button>
                <button
                  onClick={() => { setViewMode('timings'); trackViewModeChange('timings'); }}
                  className={`flex items-center px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    viewMode === 'timings'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Clock size={14} className="mr-1" />
                  Timings
                </button>
              </div>

              <button
                onClick={() => {
                  const newShowDashboard = !showDashboard;
                  setShowDashboard(newShowDashboard);
                  if (newShowDashboard) {
                    trackDashboardView();
                  }
                }}
                className={`flex items-center px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  showDashboard
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <BarChart3 size={16} className="mr-1 md:mr-2" />
                Dashboard
              </button>
              <button
                onClick={exportToICS}
                className="flex items-center px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
              >
                <Download size={16} className="mr-1 md:mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="filter-container">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <div className="filter-buttons flex flex-wrap gap-2 md:gap-3">
                {filterButtons.map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveFilter(key);
                      trackFilterUsage(key);
                    }}
                    className={`flex items-center px-3 md:px-4 py-2 rounded-lg text-white text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeFilter === key
                        ? `${color} shadow-lg scale-105`
                        : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                  >
                    <Icon size={14} className="mr-1 md:mr-2" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500 whitespace-nowrap">My Class:</label>
                <select
                  value={activeClass}
                  onChange={(e) => { setActiveClass(e.target.value); trackFilterUsage(`class:${e.target.value}`); }}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Classes</option>
                  {['Pre-KG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map((cls) => (
                    <option key={cls} value={cls}>{cls === 'Pre-KG' ? 'Pre-KG' : cls === 'LKG' ? 'LKG' : cls === 'UKG' ? 'UKG' : `Class ${cls}`}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        {showDashboard && (
          <div className="mb-8">
            <Dashboard events={events} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {viewMode === 'calendar' ? (
            <>
              {/* Calendar Section */}
              <div className="col-span-1 lg:col-span-3">
                {/* Mobile Agenda View (shown on small screens) */}
                <div className="block md:hidden">
                  <MobileAgenda
                    events={filteredEvents}
                    date={date}
                    onDateChange={setDate}
                    onEventClick={setSelectedEvent}
                  />
                </div>

                {/* Desktop Calendar View (hidden on small screens) */}
                <div className="hidden md:block bg-white rounded-xl shadow-lg p-2 sm:p-4 md:p-6">
                  <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px]">
                    <Calendar
                      localizer={localizer}
                      events={filteredEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: '100%' }}
                      onSelectEvent={handleSelectEvent}
                      eventPropGetter={eventStyleGetter}
                      view={currentView}
                      onView={(newView) => {
                        setCurrentView(newView);
                        trackCalendarInteraction('view_change', '', newView);
                      }}
                      date={date}
                      onNavigate={(newDate) => {
                        setDate(newDate);
                        trackCalendarInteraction(
                          'date_navigation',
                          '',
                          moment(newDate).format('MMMM YYYY')
                        );
                      }}
                      popup
                      popupOffset={{ x: 30, y: 20 }}
                      className="mobile-friendly-calendar"
                      views={['month', 'week', 'day', 'agenda']}
                      toolbar={true}
                    />
                  </div>
                </div>
              </div>

              {/* Events List Sidebar - Hidden on mobile since we have MobileAgenda */}
              <div className="hidden md:block lg:col-span-1 order-first lg:order-last">
                <EventList
                  events={filteredEvents}
                  onEventClick={setSelectedEvent}
                  activeFilter={activeFilter}
                />
              </div>
            </>
          ) : viewMode === 'timings' ? (
            <div className="lg:col-span-4">
              <TimingsView />
            </div>
          ) : (
            /* Sections View */
            <div className="lg:col-span-4">
              <SectionsView
                events={filteredEvents}
                onEventClick={setSelectedEvent}
              />
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}

      {/* Search Modal */}
      {showSearch && (
        <SearchModal
          events={events}
          onEventClick={(event) => { setSelectedEvent(event); }}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Notification Settings Panel */}
      {showNotifSettings && (
        <NotificationSettings
          prefs={prefs}
          updatePrefs={updatePrefs}
          permissionStatus={permissionStatus}
          requestPermission={requestPermission}
          onClose={() => setShowNotifSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
