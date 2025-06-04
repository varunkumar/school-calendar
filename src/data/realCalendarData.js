import calendarData from './data.json';

// Helper function to parse dates
const parseDate = (dateStr, month, year) => {
  // Handle various date formats
  if (dateStr.includes(' & ')) {
    // Handle multiple dates like "14.01.2026 & 15.01.2026"
    return dateStr.split(' & ').map((d) => parseDate(d.trim(), month, year));
  }

  if (dateStr.includes('-')) {
    // Handle date ranges like "01.10.2025-11.10.2025"
    const [start, end] = dateStr.split('-');
    return {
      start: parseDate(start.trim(), month, year),
      end: parseDate(end.trim(), month, year),
    };
  }

  if (dateStr.includes('.')) {
    // Handle DD.MM.YYYY format
    const [day, monthNum, yearNum] = dateStr.split('.');
    return new Date(parseInt(yearNum), parseInt(monthNum) - 1, parseInt(day));
  }

  // Handle day number from calendar (DD format)
  const day = parseInt(dateStr);
  if (isNaN(day)) return null;

  return new Date(year, month, day);
};

// Helper function to categorize events
const categorizeEvent = (activity) => {
  const activityLower = activity.toLowerCase();

  if (
    activityLower.includes('holiday') ||
    activityLower.includes('bakrid') ||
    activityLower.includes('muharram') ||
    activityLower.includes('christmas') ||
    activityLower.includes('pongal') ||
    activityLower.includes('republic day') ||
    activityLower.includes('ugadi') ||
    activityLower.includes('good friday') ||
    activityLower.includes('tamil new year') ||
    activityLower.includes('thiruvalluvar') ||
    activityLower.includes('uzhavar') ||
    activityLower.includes('idul fitr')
  ) {
    return 'holiday';
  }

  if (activityLower.includes('vacation') || activityLower.includes('summer')) {
    return 'vacation';
  }

  if (
    activityLower.includes('exam') ||
    activityLower.includes('test') ||
    activityLower.includes('assessment') ||
    activityLower.includes('fa/pa') ||
    activityLower.includes('unit test')
  ) {
    return 'exam';
  }

  if (
    activityLower.includes('assembly') ||
    activityLower.includes('special assembly') ||
    activityLower.includes('investiture') ||
    activityLower.includes('ceremony')
  ) {
    return 'assembly';
  }

  if (
    activityLower.includes('competition') ||
    activityLower.includes('sports') ||
    activityLower.includes('intramural') ||
    activityLower.includes('inter house') ||
    activityLower.includes('class competition')
  ) {
    return 'competition';
  }

  if (
    activityLower.includes('field trip') ||
    activityLower.includes('trip') ||
    activityLower.includes('excursion')
  ) {
    return 'trip';
  }

  if (
    activityLower.includes('club activities') ||
    activityLower.includes('club') ||
    activityLower.includes('exhibition') ||
    activityLower.includes('talent show') ||
    activityLower.includes('rainbow week') ||
    activityLower.includes('class event')
  ) {
    return 'activity';
  }

  return 'academic';
};

// Helper function to extract classes from activity text
const extractClasses = (activity) => {
  const classMatches = activity.match(/classes?\s+([IVX\-\d,\s&KG]+)/i);
  if (classMatches) {
    return classMatches[1].replace(/\s+/g, ' ').trim();
  }

  if (activity.toLowerCase().includes('kg')) {
    return 'KG';
  }

  return 'All Classes';
};

// Transform academic calendar data
const transformAcademicCalendar = () => {
  const events = [];
  let eventId = 1;

  calendarData.academic_calendar.forEach((monthData) => {
    const [monthName, yearStr] = monthData.month_year.split(' ');
    const year = parseInt(yearStr);
    const monthIndex = new Date(Date.parse(monthName + ' 1, 2025')).getMonth();

    // Process general activities (monthly events)
    monthData.general_activities?.forEach((activity) => {
      events.push({
        id: eventId++,
        title: activity.replace(/\[cite:.*?\]/g, '').trim(),
        date: new Date(year, monthIndex, 1), // First day of month for general activities
        category: categorizeEvent(activity),
        description: `Monthly activity for ${monthData.month_year}`,
        classes: extractClasses(activity),
        isGeneralActivity: true,
      });
    });

    // Process daily activities
    monthData.daily_activities?.forEach((dayData) => {
      const date = parseDate(dayData.date, monthIndex, year);

      dayData.activity.forEach((activity) => {
        const category = categorizeEvent(activity);
        events.push({
          id: eventId++,
          title: activity.replace(/\[cite:.*?\]/g, '').trim(),
          date: date,
          category: category,
          description: `${dayData.date}, ${monthData.month_year}`,
          classes: extractClasses(activity),
          dayOfWeek: dayData.day,
        });
      });
    });
  });

  return events;
};

// Transform holidays data
const transformHolidays = () => {
  const events = [];
  let eventId = 10000; // Start with high ID to avoid conflicts

  calendarData.holidays.forEach((holiday) => {
    const dateStr = holiday.date.replace(/\[cite:.*?\]/g, '').trim();
    const occasion = holiday.occasion.replace(/\[cite:.*?\]/g, '').trim();

    if (dateStr.includes(' & ')) {
      // Multiple dates
      const dates = dateStr.split(' & ');
      dates.forEach((date) => {
        const parsedDate = parseDate(date.trim());
        if (parsedDate) {
          events.push({
            id: eventId++,
            title: occasion,
            date: parsedDate,
            category: 'holiday',
            description: 'Public Holiday',
            classes: 'All Classes',
            isHoliday: true,
          });
        }
      });
    } else {
      const parsedDate = parseDate(dateStr);
      if (parsedDate) {
        events.push({
          id: eventId++,
          title: occasion,
          date: parsedDate,
          category: 'holiday',
          description: 'Public Holiday',
          classes: 'All Classes',
          isHoliday: true,
        });
      }
    }
  });

  return events;
};

// Transform vacations data
const transformVacations = () => {
  const events = [];
  let eventId = 20000; // Start with high ID to avoid conflicts

  calendarData.vacations.forEach((vacation) => {
    const term = vacation.term;
    const dateStr = vacation.dates
      .replace(/\[cite:.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .trim();
    const applicableTo = vacation.applicable_to;

    // Parse date range
    if (dateStr.includes('-')) {
      const [startStr, endStr] = dateStr.split(':');
      const startDate = new Date(startStr),
        endDate = new Date(endStr);

      if (startDate && endDate) {
        events.push({
          id: eventId++,
          title: `${term} Vacation`,
          date: startDate,
          endDate: endDate,
          category: 'vacation',
          description: `Vacation period for ${applicableTo}`,
          classes: applicableTo || 'All Classes',
          isVacation: true,
          duration:
            Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1,
        });
      }
    }
  });

  return events;
};

// Transform special assembly schedule data
const transformSpecialAssemblies = () => {
  const events = [];
  let eventId = 15000; // Start with high ID to avoid conflicts

  calendarData.special_assembly_schedule.forEach((assembly) => {
    const monthName = assembly.month;
    const day = parseInt(assembly.date);
    const year = parseInt(assembly.year || '2025'); // Default to 2025 if year is missing
    const event = assembly.event.replace(/\[cite:.*?\]/g, '').trim();
    const department = assembly.department.replace(/\[cite:.*?\]/g, '').trim();

    // Convert month name to month index
    const monthIndex = new Date(Date.parse(monthName + ' 1, 2025')).getMonth();
    const assemblyDate = new Date(year, monthIndex, day);

    events.push({
      id: eventId++,
      title: event,
      date: assemblyDate,
      category: 'assembly',
      description: `Special Assembly by ${department}`,
      classes: 'All Classes',
      department: department,
      isSpecialAssembly: true,
    });
  });

  return events;
};

// Combine events - separate single-day events from multi-day vacations
const academicEvents = transformAcademicCalendar();
const holidayEvents = transformHolidays();
const vacationEvents = transformVacations();
const specialAssemblyEvents = transformSpecialAssemblies();

// Single-day events (everything except vacations)
export const singleDayEvents = [
  ...academicEvents,
  ...holidayEvents,
  ...specialAssemblyEvents,
];

// Multi-day vacation events
export const vacationPeriods = vacationEvents;

// All events combined for calendar display
export const allCalendarEvents = [...singleDayEvents, ...vacationEvents];

// Sort events by date
export const realEvents = allCalendarEvents.sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);

// Export categorized events for sections view (excluding vacations from regular categories)
export const eventsByCategory = {
  academic: singleDayEvents.filter((event) => event.category === 'academic'),
  assembly: singleDayEvents.filter((event) => event.category === 'assembly'),
  competition: singleDayEvents.filter(
    (event) => event.category === 'competition'
  ),
  activity: singleDayEvents.filter((event) => event.category === 'activity'),
  exam: singleDayEvents.filter((event) => event.category === 'exam'),
  trip: singleDayEvents.filter((event) => event.category === 'trip'),
  holiday: singleDayEvents.filter((event) => event.category === 'holiday'),
  vacation: vacationPeriods, // Keep vacations separate as multi-day events
};

// Export summary statistics
export const calendarStats = {
  totalEvents: realEvents.length,
  singleDayEvents: singleDayEvents.length,
  academicEvents: eventsByCategory.academic.length,
  assemblies: eventsByCategory.assembly.length,
  competitions: eventsByCategory.competition.length,
  activities: eventsByCategory.activity.length,
  exams: eventsByCategory.exam.length,
  trips: eventsByCategory.trip.length,
  holidays: eventsByCategory.holiday.length,
  vacations: eventsByCategory.vacation.length,
};

// Default export for backward compatibility
export default realEvents;
