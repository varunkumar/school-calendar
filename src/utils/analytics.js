// Google Analytics utility functions

// Initialize Google Analytics
export const GA_MEASUREMENT_ID =
  process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize GA
export const initGA = () => {
  if (
    typeof window !== 'undefined' &&
    GA_MEASUREMENT_ID &&
    GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
  ) {
    // Load gtag script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_title: 'School Calendar Portal',
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (page_title, page_location) => {
  if (
    typeof window !== 'undefined' &&
    window.gtag &&
    GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
  ) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title,
      page_location,
    });
  }
};

// Track events
export const trackEvent = (
  action,
  category = 'General',
  label = '',
  value = 0
) => {
  if (
    typeof window !== 'undefined' &&
    window.gtag &&
    GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
  ) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for school calendar
export const trackCalendarInteraction = (
  action,
  eventType = '',
  eventTitle = ''
) => {
  trackEvent(action, 'Calendar Interaction', `${eventType}: ${eventTitle}`);
};

export const trackFilterUsage = (filterType) => {
  trackEvent('filter_used', 'Filter Usage', filterType);
};

export const trackEventView = (eventTitle, eventCategory) => {
  trackEvent(
    'event_viewed',
    'Event Interaction',
    `${eventCategory}: ${eventTitle}`
  );
};

export const trackDashboardView = () => {
  trackEvent('dashboard_viewed', 'Dashboard');
};

export const trackExportAction = (format = 'ics') => {
  trackEvent('export_calendar', 'Export', format);
};

export const trackViewModeChange = (mode) => {
  trackEvent('view_mode_changed', 'Navigation', mode);
};

export const trackSearchUsage = (searchTerm) => {
  trackEvent('search_used', 'Search', searchTerm);
};

// Enhanced ecommerce-like tracking for educational insights
export const trackAcademicEngagement = (eventType, duration = 0) => {
  trackEvent('academic_engagement', 'Education', eventType, duration);
};

export const trackUserJourney = (journey_step) => {
  trackEvent('user_journey', 'User Flow', journey_step);
};
