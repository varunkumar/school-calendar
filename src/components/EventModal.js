import { BookOpen, Calendar, Clock, MapPin, Users, X } from 'lucide-react';
import moment from 'moment';
import React from 'react';
import { trackAcademicEngagement } from '../utils/analytics';

const EventModal = ({ event, onClose }) => {
  // Track when modal is opened (academic engagement)
  React.useEffect(() => {
    if (event) {
      trackAcademicEngagement(event.category);
    }
  }, [event]);

  if (!event) return null;

  const getEventIcon = (type) => {
    switch (type) {
      case 'holiday':
        return <Calendar className="h-6 w-6 text-red-500" />;
      case 'assembly':
        return <Users className="h-6 w-6 text-green-500" />;
      case 'vacation':
        return <Clock className="h-6 w-6 text-orange-500" />;
      case 'academic':
        return <BookOpen className="h-6 w-6 text-blue-500" />;
      default:
        return <Calendar className="h-6 w-6 text-gray-500" />;
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'holiday':
        return 'Holiday';
      case 'assembly':
        return 'Special Assembly';
      case 'vacation':
        return 'Vacation';
      case 'academic':
        return 'Academic Event';
      default:
        return 'Event';
    }
  };

  const formatEventDate = (start, end) => {
    const startMoment = moment(start);
    const endMoment = moment(end);

    if (startMoment.isSame(endMoment, 'day')) {
      return startMoment.format('MMMM Do, YYYY');
    } else {
      return `${startMoment.format('MMM Do')} - ${endMoment.format(
        'MMM Do, YYYY'
      )}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              {getEventIcon(event.category || event.type)}
              <div className="ml-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-2">
                  {getEventTypeLabel(event.category || event.type)}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {event.title}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-3" />
              <span>{formatEventDate(event.start, event.end)}</span>
            </div>

            {event.time && (
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-3" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3" />
                <span>{event.location}</span>
              </div>
            )}

            {event.description && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {event.participants && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Participants
                </h3>
                <p className="text-gray-600 text-sm">{event.participants}</p>
              </div>
            )}

            {event.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Additional Notes
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {event.notes}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
