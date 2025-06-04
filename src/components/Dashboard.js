import {
  BookOpen,
  Calendar,
  Clock,
  Home,
  TrendingUp,
  Users,
} from 'lucide-react';
import moment from 'moment';
import { useMemo } from 'react';

const Dashboard = ({ events }) => {
  const stats = useMemo(() => {
    const today = moment();
    const thisMonth = moment().month();
    const thisYear = moment().year();

    // Count events by type
    const academicEvents = events.filter(
      (e) => e.category === 'academic'
    ).length;
    const assemblies = events.filter((e) => e.category === 'assembly').length;
    const holidays = events.filter((e) => e.category === 'holiday').length;
    const vacations = events.filter((e) => e.category === 'vacation').length;
    const exams = events.filter((e) => e.category === 'exam').length;
    const competitions = events.filter(
      (e) => e.category === 'competition'
    ).length;
    const activities = events.filter((e) => e.category === 'activity').length;
    const trips = events.filter((e) => e.category === 'trip').length;

    // Upcoming events (next 30 days)
    const upcomingEvents = events.filter((event) => {
      const eventDate = moment(event.date);
      return (
        eventDate.isAfter(today) && eventDate.isBefore(moment().add(30, 'days'))
      );
    }).length;

    // This month's events
    const thisMonthEvents = events.filter((event) => {
      const eventDate = moment(event.date);
      return eventDate.month() === thisMonth && eventDate.year() === thisYear;
    }).length;

    // Days until next vacation
    const nextVacation = events
      .filter((e) => e.category === 'vacation')
      .find((event) => moment(event.date).isAfter(today));

    const daysUntilVacation = nextVacation
      ? moment(nextVacation.date).diff(today, 'days')
      : null;

    return {
      academicEvents,
      assemblies,
      holidays,
      vacations,
      exams,
      competitions,
      activities,
      trips,
      upcomingEvents,
      thisMonthEvents,
      daysUntilVacation,
      nextVacation,
    };
  }, [events]);

  const statCards = [
    {
      title: 'Academic Events',
      value: stats.academicEvents,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Special Assemblies',
      value: stats.assemblies,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Holidays',
      value: stats.holidays,
      icon: Home,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: 'Vacation Periods',
      value: stats.vacations,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mx-auto max-w-7xl">
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start">
          <TrendingUp className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3 text-primary-600" />
          Academic Calendar Overview
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          School year 2025-2026 statistics and insights
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-4 md:p-6 border border-gray-100`}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs md:text-sm font-medium ${stat.textColor} truncate`}
                >
                  {stat.title}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} rounded-lg p-2 md:p-3 flex-shrink-0 ml-2`}
              >
                <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 md:p-6 border border-primary-200">
          <div className="flex items-center mb-3">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary-600 mr-2" />
            <h3 className="font-semibold text-primary-900 text-sm md:text-base">
              This Month
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-primary-800">
            {stats.thisMonthEvents}
          </p>
          <p className="text-xs md:text-sm text-primary-600 mt-1">
            Events in {moment().format('MMMM')}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 md:p-6 border border-green-200">
          <div className="flex items-center mb-3">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-900 text-sm md:text-base">
              Next 30 Days
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-green-800">
            {stats.upcomingEvents}
          </p>
          <p className="text-xs md:text-sm text-green-600 mt-1">
            Upcoming events
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 md:p-6 border border-orange-200">
          <div className="flex items-center mb-3">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600 mr-2" />
            <h3 className="font-semibold text-orange-900 text-sm md:text-base">
              Next Break
            </h3>
          </div>
          {stats.daysUntilVacation !== null ? (
            <>
              <p className="text-xl md:text-2xl font-bold text-orange-800">
                {stats.daysUntilVacation}
              </p>
              <p className="text-xs md:text-sm text-orange-600 mt-1">
                Days until {stats.nextVacation?.title}
              </p>
            </>
          ) : (
            <>
              <p className="text-xl md:text-2xl font-bold text-orange-800">-</p>
              <p className="text-xs md:text-sm text-orange-600 mt-1">
                No upcoming breaks
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
