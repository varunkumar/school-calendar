import { Clock } from 'lucide-react';
import { schoolTimings } from '../data/realCalendarData';

const TimingCard = ({ group }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{group.group}</h3>
      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
        {group.start} – {group.end}
      </span>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{group.days}</p>
    {group.periods.length > 0 && (
      <table className="w-full text-sm">
        <tbody>
          {group.periods.map((p, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/30' : ''}>
              <td className="py-1 px-2 text-gray-700 dark:text-gray-300 font-medium w-1/2">{p.label}</td>
              <td className="py-1 px-2 text-gray-600 dark:text-gray-300">{p.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const TimingsView = ({ activeClass = 'all' }) => {
  const allGroups = schoolTimings;

  const mainGroups = allGroups.filter((g) => {
    if (g.group.startsWith('Office') || g.group.startsWith('After')) return false;
    if (activeClass === 'all') return true;
    return !g.class_range || g.class_range.length === 0 || g.class_range.includes(activeClass);
  });

  const infoGroups = allGroups.filter((g) => {
    if (!g.group.startsWith('Office') && !g.group.startsWith('After')) return false;
    if (activeClass === 'all') return true;
    // After School Activity applies to classes I–XII
    if (g.group.startsWith('After')) return g.class_range?.includes(activeClass) ?? true;
    return true; // Office hours always shown
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainGroups.map((g) => (
          <TimingCard key={g.group} group={g} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {infoGroups.map((g) => (
          <div key={g.group} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm">{g.group}</p>
              <p className="text-blue-700 dark:text-blue-400 text-sm">{g.start} – {g.end}</p>
              <p className="text-blue-500 text-xs">{g.days}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimingsView;
