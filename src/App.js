import {
  BookOpen,
  Calendar as CalendarIcon,
  CreditCard,
  GraduationCap,
  Home,
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
import FeesView from './components/FeesView';
import EventModal from './components/EventModal';
import Header from './components/Header';
import AgendaView from './components/AgendaView';
import MobileAgenda from './components/MobileAgenda';
import NotificationSettings from './components/NotificationSettings';
import OfflineIndicator from './components/OfflineIndicator';
import SearchModal from './components/SearchModal';
import SectionsView from './components/SectionsView';
import TimingsView from './components/TimingsView';
import { allCalendarEvents } from './data/realCalendarData';
import { useNotifications } from './hooks/useNotifications';
import { useTheme } from './hooks/useTheme';
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
  const { isDark, toggleTheme } = useTheme();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [events] = useState(allCalendarEvents);
  const { prefs, updatePrefs, permissionStatus, requestPermission, clearAll } = useNotifications(events);
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
    { key: 'exam',     label: 'Exam',      icon: GraduationCap, color: 'bg-violet-500' },
    { key: 'activity', label: 'Activity', icon: Zap,           color: 'bg-cyan-500' },
    { key: 'holiday',  label: 'Holiday',   icon: Home,          color: 'bg-red-500' },
    { key: 'vacation', label: 'Vacation',   icon: Plane,         color: 'bg-amber-500' },
    { key: 'fee',      label: 'Fee',        icon: CreditCard,    color: 'bg-red-600' },
    { key: 'ptm',      label: 'PTM',        icon: Users,         color: 'bg-violet-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Header
        onBellClick={() => setShowNotifSettings(true)}
        onReset={handleReset}
        showDashboard={showDashboard}
        onDashboardToggle={() => {
          const next = !showDashboard;
          setShowDashboard(next);
          if (next) trackDashboardView();
        }}
        onExport={exportToICS}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {/* View Tabs */}
        <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'calendar', label: 'Calendar', Icon: CalendarIcon },
            { key: 'sections', label: 'Sections',  Icon: GraduationCap },
            { key: 'timings',  label: 'Timings',   Icon: BookOpen },
            { key: 'fees',     label: 'Fees',      Icon: CreditCard },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { setViewMode(key); trackViewModeChange(key); }}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors -mb-px ${
                viewMode === key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              }`}
            >
              <Icon size={14} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Search + Class row */}
        <div className="flex gap-3 mb-3">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center flex-1 px-4 py-2 text-sm text-gray-400 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500"
          >
            <Search className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Search events…</span>
            <span className="ml-auto text-xs bg-gray-100 px-1.5 py-0.5 rounded hidden sm:inline">⌘K</span>
          </button>
          <select
            value={activeClass}
            onChange={(e) => { setActiveClass(e.target.value); trackFilterUsage(`class:${e.target.value}`); }}
            className="text-sm border border-gray-200 rounded-lg px-2 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm flex-shrink-0 max-w-[130px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="all">All Classes</option>
            {['Pre-KG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map((cls) => (
              <option key={cls} value={cls}>
                {['Pre-KG', 'LKG', 'UKG'].includes(cls) ? cls : `Class ${cls}`}
              </option>
            ))}
          </select>
        </div>

        {/* Category chips — wraps to next line, hidden on Timings view */}
        {viewMode !== 'timings' && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filterButtons.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => { setActiveFilter(key); trackFilterUsage(key); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === key
                    ? `${color} text-white shadow-md`
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-400'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        )}


        {/* Dashboard */}
        {showDashboard && (
          <div className="mb-8">
            <Dashboard events={filteredEvents} />
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
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 sm:p-4 md:p-6">
                  {currentView === 'agenda' ? (
                    /* Custom agenda view — replaces rbc's broken table-rowspan agenda */
                    <div>
                      <div className="flex gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                        {['month', 'week', 'day', 'agenda'].map((v) => (
                          <button
                            key={v}
                            onClick={() => setCurrentView(v)}
                            className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors ${
                              currentView === v
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      <AgendaView
                        events={filteredEvents}
                        date={date}
                        onEventClick={setSelectedEvent}
                      />
                    </div>
                  ) : (
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
                  )}
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
              <TimingsView activeClass={activeClass} />
            </div>
          ) : viewMode === 'fees' ? (
            <div className="lg:col-span-4">
              <FeesView activeClass={activeClass} />
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
          clearAll={clearAll}
          onClose={() => setShowNotifSettings(false)}
        />
      )}

      <OfflineIndicator />

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        Built with ♥ by{' '}
        <a href="https://twitter.com/varunkumar" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">@varunkumar</a>
        {' · '}
        <a href="https://instagram.com/varunkumar" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Instagram</a>
      </footer>
    </div>
  );
}

export default App;
