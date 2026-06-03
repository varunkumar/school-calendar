import { Search, X } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';

const CATEGORY_COLORS = {
  academic: 'bg-blue-500',
  exam:     'bg-violet-500',
  activity: 'bg-cyan-500',
  holiday:  'bg-red-500',
  vacation: 'bg-amber-500',
  fee:      'bg-red-600',
  ptm:      'bg-violet-700',
};

const SearchModal = ({ events, onEventClick, onClose }) => {
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const results = useMemo(() => {
    if (query.trim().length < 1) return [];
    const q = query.toLowerCase();
    return events
      .filter((e) =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.classes?.toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [query, events]);

  const grouped = useMemo(() => {
    const map = {};
    results.forEach((e) => {
      const key = moment(e.date).format('MMMM YYYY');
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return Object.entries(map);
  }, [results]);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && results[highlighted]) {
      onEventClick(results[highlighted]);
      onClose();
    }
  };

  let resultIndex = 0;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search events..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
            onKeyDown={handleKey}
            className="flex-1 text-base outline-none text-gray-900 placeholder-gray-400"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {query.length < 1 && (
            <p className="text-sm text-gray-400 text-center py-8">Start typing to search…</p>
          )}
          {query.length >= 1 && results.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No events match "{query}"</p>
          )}
          {grouped.map(([month, monthEvents]) => (
            <div key={month}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2 bg-gray-50 sticky top-0">
                {month}
              </p>
              {monthEvents.map((event) => {
                const idx = resultIndex++;
                const isHighlighted = idx === highlighted;
                return (
                  <button
                    key={event.id}
                    onClick={() => { onEventClick(event); onClose(); }}
                    onMouseEnter={() => setHighlighted(idx)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      isHighlighted ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_COLORS[event.category] || 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-400 w-24 flex-shrink-0">
                      {moment(event.date).format('ddd D MMM')}
                    </span>
                    <span className="text-sm text-gray-900 truncate">{event.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
            <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
