// Application configuration
export const config = {
  // School Information
  school: {
    name: process.env.REACT_APP_SCHOOL_NAME || 'School Calendar Portal',
    academicYear: process.env.REACT_APP_ACADEMIC_YEAR || '2025-2026',
    contactEmail: process.env.REACT_APP_CONTACT_EMAIL || 'admin@school.edu',
  },

  // Feature Flags
  features: {
    enableExport: process.env.REACT_APP_ENABLE_EXPORT !== 'false', // default true
    enableSearch: process.env.REACT_APP_ENABLE_SEARCH !== 'false', // default true
    enableAnalytics: !!process.env.REACT_APP_GA_MEASUREMENT_ID,
  },

  // Theme Configuration
  theme: {
    primaryColor: process.env.REACT_APP_PRIMARY_COLOR || '#3b82f6',
    secondaryColor: process.env.REACT_APP_SECONDARY_COLOR || '#10b981',
    colors: {
      academic: '#3b82f6',
      holiday: '#ef4444',
      assembly: '#10b981',
      vacation: '#f59e0b',
      exam: '#8b5cf6',
      competition: '#ea580c',
      activity: '#06b6d4',
      trip: '#65a30d',
    },
  },

  // Calendar Settings
  calendar: {
    defaultView: 'month',
    firstDayOfWeek: 1, // Monday
    timeFormat: '24h',
    dateFormat: 'DD/MM/YYYY',
  },

  // Analytics Configuration
  analytics: {
    measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID,
    trackPageViews: true,
    trackEvents: true,
    trackUserJourney: true,
  },

  // Export Settings
  export: {
    formats: ['ics', 'csv', 'pdf'],
    defaultFormat: 'ics',
    includeDescription: true,
    includeLocation: true,
  },
};

export default config;
