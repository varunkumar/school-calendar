import {
  BarChart3,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Download,
  GraduationCap,
  Grid,
  Home,
  List,
  MapPin,
  Search,
  Trophy,
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
import SectionsView from './components/SectionsView';
import { allCalendarEvents } from './data/realCalendarData';
import {
  initGA,
  trackCalendarInteraction,
  trackDashboardView,
  trackEventView,
  trackExportAction,
  trackFilterUsage,
  trackPageView,
  trackSearchUsage,
  trackViewModeChange,
} from './utils/analytics';

const localizer = momentLocalizer(moment);

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [events] = useState(allCalendarEvents);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'sections'

  useEffect(() => {
    initGA();
    trackPageView();
  }, []);

  // Track search usage with debounce
  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        trackSearchUsage(searchTerm);
      }, 1000); // Debounce search tracking by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  // Filter events based on active filter and search term
  const filteredEvents = useMemo(() => {
    let filtered = events.map((event) => ({
      ...event,
      start: event.date,
      end: event.endDate || event.date,
    }));

    if (activeFilter !== 'all') {
      filtered = filtered.filter((event) => event.category === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.classes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [events, activeFilter, searchTerm]);

  // Custom event style getter
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6';

    switch (event.category) {
      case 'holiday':
        backgroundColor = '#ef4444';
        break;
      case 'assembly':
        backgroundColor = '#10b981';
        break;
      case 'vacation':
        backgroundColor = '#f59e0b';
        break;
      case 'academic':
        backgroundColor = '#3b82f6';
        break;
      case 'exam':
        backgroundColor = '#8b5cf6';
        break;
      case 'competition':
        backgroundColor = '#f97316';
        break;
      case 'activity':
        backgroundColor = '#06b6d4';
        break;
      case 'trip':
        backgroundColor = '#84cc16';
        break;
      default:
        backgroundColor = '#6b7280';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
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
    {
      key: 'all',
      label: 'All Events',
      icon: CalendarIcon,
      color: 'bg-gray-500',
    },
    {
      key: 'academic',
      label: 'Academic',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    { key: 'holiday', label: 'Holidays', icon: Home, color: 'bg-red-500' },
    { key: 'assembly', label: 'Assembly', icon: Users, color: 'bg-green-500' },
    { key: 'vacation', label: 'Vacation', icon: Clock, color: 'bg-orange-500' },
    {
      key: 'exam',
      label: 'Exams',
      icon: GraduationCap,
      color: 'bg-purple-500',
    },
    {
      key: 'competition',
      label: 'Competitions',
      icon: Trophy,
      color: 'bg-orange-600',
    },
    { key: 'activity', label: 'Activities', icon: Zap, color: 'bg-cyan-500' },
    { key: 'trip', label: 'Trips', icon: MapPin, color: 'bg-lime-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Bar */}
        <div className="mb-6 md:mb-8 space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

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
          </div>
        </div>

        {/* Dashboard */}
        {showDashboard && (
          <div className="mb-8">
            <Dashboard events={events} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {viewMode === 'calendar' ? (
            <>
              {/* Calendar Section */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                  <div className="h-[500px] md:h-[600px] lg:h-[650px]">
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
                    />
                  </div>
                </div>
              </div>

              {/* Events List Sidebar */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <EventList
                  events={filteredEvents}
                  onEventClick={setSelectedEvent}
                  activeFilter={activeFilter}
                />
              </div>
            </>
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
    </div>
  );
}

export default App;
