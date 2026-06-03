import calendarData from './data.json';

const parseISODate = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const parseMonthDate = (dateStr, monthIndex, year) => {
  const day = parseInt(dateStr);
  if (isNaN(day)) return null;
  return new Date(year, monthIndex, day);
};

// Map old/verbose category strings to the 7 canonical categories
const CATEGORY_MAP = {
  assembly: 'activity',
  competition: 'activity',
  trip: 'activity',
  academic: 'academic',
  exam: 'exam',
  holiday: 'holiday',
  vacation: 'vacation',
  fee: 'fee',
  ptm: 'ptm',
  activity: 'activity',
};

const inferCategory = (text) => {
  const t = text.toLowerCase();
  if (t.includes('holiday') || t.includes('bakrid') || t.includes('muharram') ||
      t.includes('christmas') || t.includes('pongal') || t.includes('republic day') ||
      t.includes('ugadi') || t.includes('good friday') || t.includes('tamil new year') ||
      t.includes('thiruvalluvar') || t.includes('uzhavar') || t.includes('onam') ||
      t.includes('diwali') || t.includes('independence day') || t.includes('gandhi')) {
    return 'holiday';
  }
  if (t.includes('vacation') || t.includes('summer holiday') || t.includes('term holiday')) return 'vacation';
  if (t.includes('exam') || t.includes(' test') || t.includes('assessment') ||
      t.includes('fa/pa') || t.includes('sa1') || t.includes('sa2') || t.includes('revision exam')) return 'exam';
  if (t.includes('ptm') || t.includes('parent teacher') || t.includes('parent interactive') ||
      t.includes('custodian meeting')) return 'ptm';
  if (t.includes('fee') || t.includes('payment')) return 'fee';
  if (t.includes('competition') || t.includes('trip') || t.includes('field trip') ||
      t.includes('assembly') || t.includes('club') || t.includes('talent show') ||
      t.includes('exhibition') || t.includes('sports') || t.includes('athletic') ||
      t.includes('dance') || t.includes('excursion') || t.includes('ceremony') ||
      t.includes('investiture') || t.includes('graduation')) return 'activity';
  return 'academic';
};

const extractClasses = (text) => {
  const m = text.match(/classes?\s+([IVX\-\d,\s&KG]+)/i);
  if (m) return m[1].replace(/\s+/g, ' ').trim();
  if (text.toLowerCase().includes('kg')) return 'KG';
  return 'All Classes';
};

let _id = 1;
const nextId = () => _id++;

// --- Academic calendar ---
const fromAcademicCalendar = () => {
  const events = [];
  calendarData.academic_calendar.forEach(({ month_year, general_activities = [], daily_activities = [] }) => {
    const [monthName, yearStr] = month_year.split(' ');
    const year = parseInt(yearStr);
    const monthIndex = new Date(Date.parse(monthName + ' 1, 2000')).getMonth();

    general_activities.forEach((act) => {
      events.push({
        id: nextId(),
        title: act.replace(/\[cite:.*?\]/g, '').trim(),
        date: new Date(year, monthIndex, 1),
        category: inferCategory(act),
        description: `Monthly activity for ${month_year}`,
        classes: extractClasses(act),
        isGeneralActivity: true,
      });
    });

    daily_activities.forEach(({ date: dateStr, day, activity: acts }) => {
      const date = parseMonthDate(dateStr, monthIndex, year);
      if (!date) return;
      acts.forEach((act) => {
        events.push({
          id: nextId(),
          title: act.replace(/\[cite:.*?\]/g, '').trim(),
          date,
          category: inferCategory(act),
          description: `${dateStr} ${month_year}`,
          classes: extractClasses(act),
          dayOfWeek: day,
        });
      });
    });
  });
  return events;
};

// --- Holidays (authoritative) ---
const fromHolidays = () =>
  calendarData.holidays.map((h) => ({
    id: nextId(),
    title: h.name,
    date: parseISODate(h.date),
    category: 'holiday',
    description: 'Public Holiday',
    classes: 'All Classes',
  }));

// --- Vacations ---
const fromVacations = () =>
  calendarData.vacations.map((v) => ({
    id: nextId(),
    title: v.name,
    date: parseISODate(v.start),
    endDate: parseISODate(v.end),
    category: 'vacation',
    description: `Vacation for ${v.applicable_to}`,
    classes: v.applicable_to,
  }));

// --- Special assemblies → activity ---
const fromAssemblies = () =>
  calendarData.special_assemblies.map((a) => ({
    id: nextId(),
    title: a.topic,
    date: parseISODate(a.date),
    category: 'activity',
    description: 'Special Assembly',
    classes: 'All Classes',
  }));

// --- PTM schedule ---
const fromPTM = () => {
  const events = [];
  calendarData.ptm_schedule.forEach((p) => {
    p.dates.forEach((d) => {
      events.push({
        id: nextId(),
        title: p.type,
        date: parseISODate(d),
        category: 'ptm',
        description: `Term ${p.term} — ${p.class_range}`,
        classes: p.class_range,
        ptmType: p.type,
        term: p.term,
      });
    });
  });
  return events;
};

// --- Fee schedule ---
const fromFees = () =>
  calendarData.fee_schedule.map((f) => ({
    id: nextId(),
    title: `Fee Deadline – ${f.term} (${f.class_range})`,
    date: parseISODate(f.cutoff_end),
    category: 'fee',
    description: `${f.term} fee payment cutoff`,
    classes: f.class_range,
    feeAmount: f.amount,
    feeTerm: f.term,
    feeCutoffStart: f.cutoff_start,
    feeCutoffEnd: f.cutoff_end,
  }));

// --- Exam schedule ---
const fromExams = () =>
  calendarData.exam_schedule.map((e) => ({
    id: nextId(),
    title: e.assessment,
    date: parseISODate(e.date_start),
    endDate: parseISODate(e.date_end),
    category: 'exam',
    description: `${e.assessment} — ${e.class_range}`,
    classes: e.class_range,
  }));

export const schoolTimings = calendarData.school_timings;

export const allCalendarEvents = [
  ...fromAcademicCalendar(),
  ...fromHolidays(),
  ...fromVacations(),
  ...fromAssemblies(),
  ...fromPTM(),
  ...fromFees(),
  ...fromExams(),
].sort((a, b) => new Date(a.date) - new Date(b.date));

export default allCalendarEvents;
