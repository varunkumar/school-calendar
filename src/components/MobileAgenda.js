import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

const MobileAgenda = ({ events, date, onDateChange, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(moment(date));

  const goToPreviousWeek = () => {
    const newDate = moment(currentDate).subtract(1, 'week');
    setCurrentDate(newDate);
    onDateChange(newDate.toDate());
  };

  const goToNextWeek = () => {
    const newDate = moment(currentDate).add(1, 'week');
    setCurrentDate(newDate);
    onDateChange(newDate.toDate());
  };

  const goToToday = () => {
    const today = moment();
    setCurrentDate(today);
    onDateChange(today.toDate());
  };

  // Get events for the current week
  const startOfWeek = moment(currentDate).startOf('week');
  const endOfWeek = moment(currentDate).endOf('week');

  const weekEvents = events.filter((event) => {
    const eventDate = moment(event.date);
    return eventDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
  });

  // Group events by day
  const eventsByDay = {};
  for (let i = 0; i < 7; i++) {
    const day = moment(startOfWeek).add(i, 'days');
    const dayKey = day.format('YYYY-MM-DD');
    eventsByDay[dayKey] = weekEvents.filter(
      (event) => moment(event.date).format('YYYY-MM-DD') === dayKey
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      holiday: 'bg-red-100 text-red-800 border-red-200',
      assembly: 'bg-green-100 text-green-800 border-green-200',
      vacation: 'bg-orange-100 text-orange-800 border-orange-200',
      academic: 'bg-blue-100 text-blue-800 border-blue-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Agenda</h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Today
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-center">
            <h3 className="font-medium text-gray-900">
              {startOfWeek.format('MMM Do')} -{' '}
              {endOfWeek.format('MMM Do, YYYY')}
            </h3>
          </div>

          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(eventsByDay).map(([dayKey, dayEvents]) => {
          const day = moment(dayKey);
          const isToday = day.isSame(moment(), 'day');

          return (
            <div
              key={dayKey}
              className={`border-b border-gray-100 ${
                isToday ? 'bg-blue-50' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                      isToday
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium">
                        {day.format('MMM')}
                      </div>
                      <div className="text-sm font-bold">
                        {day.format('DD')}
                      </div>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4
                      className={`font-medium ${
                        isToday ? 'text-blue-900' : 'text-gray-900'
                      }`}
                    >
                      {day.format('dddd')}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {day.format('MMMM Do, YYYY')}
                    </p>
                  </div>
                </div>

                {dayEvents.length === 0 ? (
                  <p className="text-sm text-gray-400 ml-15">No events</p>
                ) : (
                  <div className="space-y-2 ml-15">
                    {dayEvents.map((event, index) => (
                      <div
                        key={index}
                        onClick={() => onEventClick(event)}
                        className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getCategoryColor(
                          event.category
                        )}`}
                      >
                        <h5 className="font-medium text-sm mb-1">
                          {event.title}
                        </h5>

                        <div className="space-y-1">
                          {event.time && (
                            <div className="flex items-center text-xs opacity-75">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{event.time}</span>
                            </div>
                          )}

                          {event.classes && (
                            <div className="flex items-center text-xs opacity-75">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{event.classes}</span>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-xs mt-2 opacity-75 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileAgenda;
