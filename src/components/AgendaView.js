import moment from 'moment';
import { School } from 'lucide-react';

const CATEGORY_COLORS = {
  academic: { bg: 'bg-blue-500',   text: 'text-white' },
  exam:     { bg: 'bg-violet-500', text: 'text-white' },
  activity: { bg: 'bg-cyan-500',   text: 'text-white' },
  holiday:  { bg: 'bg-red-500',    text: 'text-white' },
  vacation: { bg: 'bg-amber-500',  text: 'text-white' },
  fee:      { bg: 'bg-red-600',    text: 'text-white' },
  ptm:      { bg: 'bg-violet-700', text: 'text-white' },
};

const CATEGORY_LABELS = {
  academic: 'Academic',
  exam:     'Exam',
  activity: 'Activity',
  holiday:  'Holiday',
  vacation: 'Vacation',
  fee:      'Fee',
  ptm:      'PTM',
};

const AgendaView = ({ events, date, onEventClick }) => {
  // Group events by calendar date, only show from current date onward
  const fromDate = moment(date).startOf('day');

  const grouped = {};
  events.forEach((event) => {
    const d = moment(event.start || event.date);
    if (d.isBefore(fromDate)) return;
    const key = d.format('YYYY-MM-DD');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(event);
  });

  const sortedDates = Object.keys(grouped).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        No upcoming events from this date.
      </div>
    );
  }

  return (
    <div className="overflow-y-auto" style={{ maxHeight: '650px' }}>
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-gray-50 z-10">
          <tr className="border-b border-gray-200">
            <th className="text-left px-3 py-2 font-semibold text-gray-600 w-32">Date</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-600 w-24">Type</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-600">Event</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-600 hidden lg:table-cell w-40">Classes</th>
          </tr>
        </thead>
        <tbody>
          {sortedDates.map((dateKey) => {
            const dayEvents = grouped[dateKey];
            const m = moment(dateKey);
            const isToday = m.isSame(moment(), 'day');
            return dayEvents.map((event, idx) => {
              const cat = CATEGORY_COLORS[event.category] || { bg: 'bg-gray-400', text: 'text-white' };
              return (
                <tr
                  key={`${dateKey}-${idx}`}
                  onClick={() => onEventClick(event)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {/* Date — shown for every row of the group */}
                  <td className={`px-3 py-2.5 align-top whitespace-nowrap font-medium ${isToday ? 'text-primary-600' : 'text-gray-700'}`}>
                    {idx === 0 ? (
                      <span>
                        <span className="text-xs text-gray-400 block">{m.format('ddd')}</span>
                        <span className={`${isToday ? 'text-primary-600' : ''}`}>{m.format('D MMM YYYY')}</span>
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs pl-1">↳</span>
                    )}
                  </td>

                  {/* Category badge */}
                  <td className="px-3 py-2.5 align-top">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cat.bg} ${cat.text} whitespace-nowrap`}>
                      {CATEGORY_LABELS[event.category] || event.category}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="px-3 py-2.5 align-top text-gray-900">
                    {event.title}
                  </td>

                  {/* Classes */}
                  <td className="px-3 py-2.5 align-top text-gray-500 hidden lg:table-cell">
                    {event.classes && (
                      <span className="flex items-center gap-1">
                        <School className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs">{event.classes}</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AgendaView;
