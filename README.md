# School Academic Calendar Portal

A modern, responsive school academic calendar portal built with React, featuring calendar views for academic events, special assemblies, holidays, and vacations.

## Features

- 📅 **Interactive Calendar View** - Monthly calendar with event filtering
- 🎯 **Event Categories** - Academic events, holidays, special assemblies, and vacations
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, professional design with Tailwind CSS
- 🔍 **Event Details** - Detailed modal views for each event
- 📋 **Upcoming Events** - Sidebar showing next upcoming events
- 🏷️ **Event Filtering** - Filter by event type for focused viewing

## Technology Stack

- **Frontend**: React 18
- **Calendar**: React Big Calendar with Moment.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd school-calendar
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Deployment

### Netlify Deployment

This project is configured for easy deployment on Netlify:

1. Build the project:

```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your Git repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Deploy!

The `netlify.toml` file is already configured with the necessary settings.

## Customization

### Adding New Events

Edit the `src/data/sampleData.js` file to add new events:

```javascript
{
  title: 'New Event',
  start: new Date(2025, 5, 15), // June 15, 2025
  end: new Date(2025, 5, 15),
  type: 'academic', // 'academic', 'holiday', 'assembly', 'vacation'
  time: '9:00 AM - 11:00 AM',
  location: 'School Auditorium',
  description: 'Event description...',
  participants: 'Who should attend',
  notes: 'Additional notes'
}
```

### Event Types

- `academic` - Academic events (blue)
- `holiday` - Holidays (red)
- `assembly` - Special assemblies (green)
- `vacation` - Vacation periods (orange)

### Styling

The project uses Tailwind CSS for styling. Customize colors and styles in:

- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles and calendar customizations

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Top navigation header
│   ├── EventModal.js      # Event details modal
│   └── EventList.js       # Upcoming events sidebar
├── data/
│   └── sampleData.js      # Sample calendar events
├── App.js                 # Main application component
├── index.js              # Application entry point
└── index.css             # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
