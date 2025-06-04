import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

const CategorySection = ({
  title,
  events,
  icon: Icon,
  color,
  onEventClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const sortedEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Show first 5 events

  const formatEventDate = (date, endDate) => {
    const startMoment = moment(date);
    const endMoment = moment(endDate || date);

    if (startMoment.isSame(endMoment, 'day')) {
      return startMoment.format('MMM Do, YYYY');
    } else {
      return `${startMoment.format('MMM Do')} - ${endMoment.format(
        'MMM Do, YYYY'
      )}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div
        className={`${color} px-6 py-4 cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className="h-5 w-5 text-white mr-3" />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <span className="ml-3 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm text-white">
              {events.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-white" />
          ) : (
            <ChevronRight className="h-5 w-5 text-white" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Icon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No events in this category</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event, index) => (
                <div
                  key={index}
                  onClick={() => onEventClick(event)}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 hover:border-gray-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h4>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {formatEventDate(event.date, event.endDate)}
                          </span>
                        </div>

                        {event.time && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{event.time}</span>
                          </div>
                        )}

                        {event.classes && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{event.classes}</span>
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {events.length > 5 && (
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    ... and {events.length - 5} more events
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
