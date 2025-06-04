import { Calendar, ChevronRight, Clock, MapPin } from 'lucide-react';
import moment from 'moment';

const EventList = ({ events, onEventClick, activeFilter }) => {
  const today = moment();

  // Sort events by date and filter upcoming events
  const upcomingEvents = events
    .filter((event) => moment(event.date).isAfter(today, 'day'))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  const getEventColor = (category) => {
    switch (category) {
      case 'holiday':
        return 'border-l-red-500 bg-red-50';
      case 'assembly':
        return 'border-l-green-500 bg-green-50';
      case 'vacation':
        return 'border-l-orange-500 bg-orange-50';
      case 'academic':
        return 'border-l-blue-500 bg-blue-50';
      case 'exam':
        return 'border-l-purple-500 bg-purple-50';
      case 'competition':
        return 'border-l-orange-600 bg-orange-50';
      case 'activity':
        return 'border-l-cyan-500 bg-cyan-50';
      case 'trip':
        return 'border-l-lime-500 bg-lime-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getEventTypeLabel = (category) => {
    switch (category) {
      case 'holiday':
        return 'Holiday';
      case 'assembly':
        return 'Assembly';
      case 'vacation':
        return 'Vacation';
      case 'academic':
        return 'Academic';
      case 'exam':
        return 'Exam';
      case 'competition':
        return 'Competition';
      case 'activity':
        return 'Activity';
      case 'trip':
        return 'Trip';
      default:
        return 'Event';
    }
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-primary-600" />
        Upcoming Events
      </h2>

      {upcomingEvents.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
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
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-white text-gray-700 mr-2">
                      {getEventTypeLabel(event.category)}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                    {event.title}
                  </h3>

                  <div className="flex items-center text-xs text-gray-600 mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>

                  {event.time && (
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.time}</span>
                    </div>
                  )}

                  {event.classes && (
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
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
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Showing next {upcomingEvents.length} events
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;
