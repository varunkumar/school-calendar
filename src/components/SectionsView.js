import { BookOpen, CreditCard, GraduationCap, Home, Plane, Users, Zap } from 'lucide-react';
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

  const sections = [
    { title: 'Academic',         events: events.filter(e => e.category === 'academic'  && isUpcoming(e)), icon: BookOpen,      color: 'bg-blue-600',    description: 'Academic milestones and educational activities' },
    { title: 'Exam',            events: events.filter(e => e.category === 'exam'       && isUpcoming(e)), icon: GraduationCap, color: 'bg-violet-500',  description: 'Tests, assessments and examinations' },
    { title: 'Activity',       events: events.filter(e => e.category === 'activity'   && isUpcoming(e)), icon: Zap,           color: 'bg-cyan-500',    description: 'Competitions, assemblies, trips and clubs' },
    { title: 'Holiday',         events: events.filter(e => e.category === 'holiday'    && isUpcoming(e)), icon: Home,          color: 'bg-red-500',     description: 'Public and school holidays' },
    { title: 'Vacation',         events: events.filter(e => e.category === 'vacation'   && isUpcoming(e)), icon: Plane,         color: 'bg-amber-500',   description: 'Vacation periods' },
    { title: 'Fee',              events: events.filter(e => e.category === 'fee'        && isUpcoming(e)), icon: CreditCard,    color: 'bg-red-600',     description: 'Fee payment cutoff dates' },
    { title: 'PTM',              events: events.filter(e => e.category === 'ptm'        && isUpcoming(e)), icon: Users,         color: 'bg-violet-700',  description: 'Parent-teacher meetings' },
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
