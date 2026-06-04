import { Calendar, ChevronRight, Clock, School } from 'lucide-react';
import moment from 'moment';

const EventList = ({ events, onEventClick, activeFilter }) => {
  const today = moment();

  // Sort events by date and filter upcoming events
  const upcomingEvents = events
    .filter((event) => moment(event.date).isAfter(today, 'day'))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  const getEventColor = (category) => {
    const styles = {
      holiday:  'border-l-red-500 bg-red-50 dark:bg-red-900/20',
      vacation: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20',
      academic: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
      exam:     'border-l-violet-500 bg-violet-50 dark:bg-violet-900/20',
      activity: 'border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
      fee:      'border-l-red-600 bg-red-100 dark:bg-red-900/30',
      ptm:      'border-l-violet-700 bg-violet-50 dark:bg-violet-900/20',
    };
    return styles[category] || 'border-l-gray-400 bg-gray-50 dark:bg-gray-700/30';
  };

  const getEventTypeLabel = (category) => {
    const labels = {
      holiday:  'Holiday',
      vacation: 'Vacation',
      academic: 'Academic',
      exam:     'Exam',
      activity: 'Activity',
      fee:      'Fee',
      ptm:      'PTM',
    };
    return labels[category] || 'Event';
  };

  const formatEventDate = (date) => {
    const eventMoment = moment(date);
    const diffDays = eventMoment.diff(today, 'days');

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return eventMoment.format('dddd');
    return eventMoment.format('MMM Do');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-primary-600" />
        Upcoming Events
      </h2>

      {upcomingEvents.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No upcoming events
            {activeFilter !== 'all' && ` for ${activeFilter}`}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              onClick={() => onEventClick(event)}
              className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getEventColor(
                event.category
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 mr-2">
                      {getEventTypeLabel(event.category)}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {event.title}
                  </h3>

                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>

                  {event.time && (
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.time}</span>
                    </div>
                  )}

                  {event.classes && (
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <School className="h-3 w-3 mr-1" />
                      <span className="truncate">{event.classes}</span>
                    </div>
                  )}
                </div>

                <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Showing next {upcomingEvents.length} events
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;
