import { Bell, X } from 'lucide-react';

const CATEGORIES = [
  { key: 'academic', label: 'Academic',   color: 'bg-blue-500' },
  { key: 'exam',     label: 'Exams',      color: 'bg-violet-500' },
  { key: 'activity', label: 'Activities', color: 'bg-cyan-500' },
  { key: 'holiday',  label: 'Holidays',   color: 'bg-red-500' },
  { key: 'vacation', label: 'Vacation',   color: 'bg-amber-500' },
  { key: 'fee',      label: 'Fee',        color: 'bg-red-600' },
  { key: 'ptm',      label: 'PTM',        color: 'bg-violet-700' },
];

const ADVANCE_OPTIONS = [
  { days: 0, label: 'Day of (6 AM)' },
  { days: 1, label: '1 day before' },
  { days: 3, label: '3 days before' },
  { days: 7, label: '1 week before' },
];

const NotificationSettings = ({ prefs, updatePrefs, permissionStatus, requestPermission, onClose }) => {
  const toggleCategory = (key) => {
    const cats = prefs.categories.includes(key)
      ? prefs.categories.filter((c) => c !== key)
      : [...prefs.categories, key];
    updatePrefs({ categories: cats });
  };

  const toggleAdvance = (days) => {
    const adv = prefs.advanceDays.includes(days)
      ? prefs.advanceDays.filter((d) => d !== days)
      : [...prefs.advanceDays, days];
    updatePrefs({ advanceDays: adv });
  };

  const isDisabled = permissionStatus !== 'granted';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-start justify-end pt-20 pr-4 sm:pr-8"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-600" /> Notifications
          </h2>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {permissionStatus === 'unsupported' && (
          <p className="text-sm text-red-600 mb-4">Your browser doesn't support notifications.</p>
        )}
        {permissionStatus === 'denied' && (
          <p className="text-sm text-red-600 mb-4">
            Notifications blocked. Enable them in your browser's site settings, then reload.
          </p>
        )}
        {permissionStatus === 'default' && (
          <button
            onClick={requestPermission}
            className="w-full mb-4 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Enable browser notifications
          </button>
        )}

        {permissionStatus === 'granted' && (
          <label className="flex items-center justify-between mb-4 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">Notifications enabled</span>
            <button
              onClick={() => updatePrefs({ enabled: !prefs.enabled })}
              className={`relative w-10 h-5 rounded-full transition-colors ${prefs.enabled ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${prefs.enabled ? 'translate-x-5' : ''}`} />
            </button>
          </label>
        )}

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Categories</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.categories.includes(key)}
                  onChange={() => toggleCategory(key)}
                  disabled={isDisabled}
                  className="rounded text-primary-600"
                />
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">When to notify</p>
          <div className="space-y-2">
            {ADVANCE_OPTIONS.map(({ days, label }) => (
              <label key={days} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.advanceDays.includes(days)}
                  onChange={() => toggleAdvance(days)}
                  disabled={isDisabled}
                  className="rounded text-primary-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
