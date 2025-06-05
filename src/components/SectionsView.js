import { BookOpen, Clock, Home, Users } from 'lucide-react';
import CategorySection from './CategorySection';

const SectionsView = ({ events, onEventClick }) => {
  // Get current date (start of today) to filter out past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper function to check if an event is upcoming (today or in the future)
  const isUpcoming = (event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Filter events by category and only include upcoming events
  const academicEvents = events.filter(
    (e) => e.category === 'academic' && isUpcoming(e)
  );
  const assemblies = events.filter(
    (e) => e.category === 'assembly' && isUpcoming(e)
  );
  const holidays = events.filter(
    (e) => e.category === 'holiday' && isUpcoming(e)
  );
  const vacations = events.filter(
    (e) => e.category === 'vacation' && isUpcoming(e)
  );

  const sections = [
    {
      title: 'Academic Events',
      events: academicEvents,
      icon: BookOpen,
      color: 'bg-blue-600',
      description:
        'Important academic milestones, examinations, and educational activities',
    },
    {
      title: 'Special Assembly Schedule',
      events: assemblies,
      icon: Users,
      color: 'bg-green-600',
      description:
        'School-wide assemblies, presentations, and special programs',
    },
    {
      title: 'Holidays',
      events: holidays,
      icon: Home,
      color: 'bg-red-600',
      description: 'Federal holidays and school closure days',
    },
    {
      title: 'Vacations',
      events: vacations,
      icon: Clock,
      color: 'bg-orange-600',
      description: 'Extended breaks and vacation periods',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Academic Calendar Sections
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore our comprehensive academic calendar organized by categories.
          Click on any section to view detailed information about upcoming
          events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((section, index) => (
          <div key={index}>
            <div className="mb-4">
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
            <CategorySection
              title={section.title}
              events={section.events}
              icon={section.icon}
              color={section.color}
              onEventClick={onEventClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionsView;
