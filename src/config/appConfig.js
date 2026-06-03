// Application configuration
export const config = {
  // School Information
  school: {
    name: process.env.REACT_APP_SCHOOL_NAME || 'School Calendar Portal',
    academicYear: process.env.REACT_APP_ACADEMIC_YEAR || '2026-2027',
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
      academic: '#3b82f6',   // blue-500
      exam:     '#8b5cf6',   // violet-500
      activity: '#06b6d4',   // cyan-500
      holiday:  '#ef4444',   // red-500
      vacation: '#f59e0b',   // amber-500
      fee:      '#dc2626',   // red-600
      ptm:      '#7c3aed',   // violet-700
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
