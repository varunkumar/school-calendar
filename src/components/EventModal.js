import { BookOpen, Calendar, Clock, CreditCard, MapPin, Plane, School, Users, X } from 'lucide-react';
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
    const icons = {
      holiday:  <Calendar className="h-6 w-6 text-red-500" />,
      vacation: <Plane className="h-6 w-6 text-amber-500" />,
      academic: <BookOpen className="h-6 w-6 text-blue-500" />,
      exam:     <BookOpen className="h-6 w-6 text-violet-500" />,
      activity: <Users className="h-6 w-6 text-cyan-500" />,
      fee:      <CreditCard className="h-6 w-6 text-red-600" />,
      ptm:      <Users className="h-6 w-6 text-violet-700" />,
    };
    return icons[type] || <Calendar className="h-6 w-6 text-gray-500" />;
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      holiday:  'Holiday',
      vacation: 'Vacation',
      academic: 'Academic Event',
      exam:     'Exam / Assessment',
      activity: 'Activity',
      fee:      'Fee Deadline',
      ptm:      'Parent Meeting',
    };
    return labels[type] || 'Event';
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

            {event.classes && (
              <div className="flex items-start text-gray-600">
                <School className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{event.classes}</span>
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

            {event.category === 'fee' && (
              <div className="mt-4 bg-red-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-900 mb-2">Fee Details</h3>
                <div className="space-y-1 text-sm text-red-800">
                  <p><span className="font-medium">Term:</span> {event.feeTerm}</p>
                  <p><span className="font-medium">Classes:</span> {event.classes}</p>
                  <p><span className="font-medium">Amount:</span> ₹{event.feeAmount?.toLocaleString('en-IN')}</p>
                  <p><span className="font-medium">Payment window:</span> {event.feeCutoffStart} – {event.feeCutoffEnd}</p>
                </div>
              </div>
            )}
            {event.category === 'ptm' && (
              <div className="mt-4 bg-violet-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-violet-900 mb-2">Meeting Details</h3>
                <div className="space-y-1 text-sm text-violet-800">
                  <p><span className="font-medium">Type:</span> {event.ptmType}</p>
                  <p><span className="font-medium">Classes:</span> {event.classes}</p>
                  {event.term && <p><span className="font-medium">Term:</span> {event.term}</p>}
                </div>
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
