import { CreditCard } from 'lucide-react';
import calendarData from '../data/data.json';
import { compressClassRange } from '../utils/classRange';

const ALL_CLASSES = ['Pre-KG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const FeesView = ({ activeClass }) => {
  const fees = calendarData.fee_schedule;

  const filtered = activeClass === 'all'
    ? fees
    : fees.filter((f) => f.class_range.includes(activeClass));

  const grouped = filtered.reduce((acc, f) => {
    if (!acc[f.term]) acc[f.term] = [];
    acc[f.term].push(f);
    return acc;
  }, {});

  const termOrder = ['Term 1', 'Term 2', 'Books & Uniforms'];
  const terms = termOrder.filter((t) => grouped[t]);

  if (terms.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No fee information for the selected class.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {terms.map((term) => (
        <div key={term} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="bg-red-600 px-5 py-3 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-white" />
            <h3 className="text-white font-bold text-lg">{term}</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-red-50 dark:bg-red-900/20">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-red-900 dark:text-red-300">Classes</th>
                <th className="text-right px-5 py-3 font-semibold text-red-900 dark:text-red-300">Amount</th>
                <th className="text-left px-5 py-3 font-semibold text-red-900 dark:text-red-300">Payment Window</th>
              </tr>
            </thead>
            <tbody>
              {grouped[term].map((f, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/30'}>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{compressClassRange(f.class_range)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    ₹{f.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-300">
                    {f.cutoff_start} – {f.cutoff_end}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Note: Fees not paid within the stipulated time will incur a late payment charge. Learning resources are distributed only after fee clearance.
      </p>
    </div>
  );
};

export default FeesView;
