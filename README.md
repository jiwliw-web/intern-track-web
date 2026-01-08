# InternTrack - Internship Application Tracker

A modern, professional web application built with Vue 3 and Firebase for tracking internship applications. Perfect for students and job seekers to organize their application process.

## 🚀 Features

- **CRUD Operations**: Add, view, edit, and delete internship applications
- **Interview Reminders**: Visual notifications for upcoming interviews (within 7 days)
- **Status Tracking**: Track application status (Applied, Interview, Accepted, Rejected)
- **Statistics Dashboard**: Overview of application metrics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Data**: Powered by Firebase Firestore for instant updates

## 🛠️ Tech Stack

- **Frontend**: Vue 3 (Composition API)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Database**: Firebase Firestore
- **Build Tool**: Vite
- **Font**: Inter (Google Fonts)

## 📁 Project Structure

```
interntrack/
├── src/
│   ├── components/
│   │   ├── ApplicationCard.vue      # Individual application card
│   │   ├── ApplicationForm.vue      # Add/Edit application modal
│   │   ├── InterviewReminders.vue   # Upcoming interviews widget
│   │   ├── StatCard.vue            # Statistics card component
│   │   └── StatusBadge.vue         # Status indicator badge
│   ├── services/
│   │   └── firebase.js             # Firebase configuration & services
│   ├── App.vue                     # Main application component
│   ├── main.js                     # Application entry point
│   └── style.css                   # Global styles & Tailwind imports
├── index.html                      # HTML template
├── package.json                    # Dependencies & scripts
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
└── vite.config.js                  # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interntrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - The Firebase configuration is already included in `src/services/firebase.js`
   - Make sure your Firebase project has Firestore enabled
   - Create a collection named `applications` in Firestore (it will be created automatically when you add your first application)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎨 Design Features

### Color Coding
- **Applied**: Blue/Gray - Indicates submitted applications
- **Interview**: Yellow/Orange - Scheduled interviews
- **Accepted**: Green - Successful applications
- **Rejected**: Red - Declined applications

### Icons & Visual Cues
- **Company**: Briefcase icon
- **Location**: Map pin icon
- **Dates**: Calendar and clock icons
- **Actions**: Edit (pencil) and delete (trash) icons
- **Reminders**: Bell icon for upcoming interviews

### Responsive Layout
- Desktop-first design with mobile optimization
- Card-based layout for easy scanning
- Collapsible navigation and adaptive grid system

## 📊 Application Data Structure

Each application contains:
- `companyName` (string) - Company name
- `businessType` (string) - Industry/business type
- `location` (string) - Job location
- `appliedDate` (date) - When you applied
- `interviewDate` (date) - Interview date (optional)
- `status` (string) - Current status
- `reminderEnabled` (boolean) - Interview reminder flag
- `note` (string) - Additional notes
- `createdAt` (timestamp) - Auto-generated
- `updatedAt` (timestamp) - Auto-generated

## 🔧 Customization

### Adding New Status Types
1. Update the validator in `StatusBadge.vue`
2. Add new status configuration in the `statusConfig` object
3. Update the select options in `ApplicationForm.vue`

### Changing Colors
Modify the Tailwind classes in:
- `StatusBadge.vue` for status colors
- `StatCard.vue` for metric card colors
- `style.css` for global component styles

### Adding New Fields
1. Update the form in `ApplicationForm.vue`
2. Modify the Firestore service in `firebase.js`
3. Update the display components (`ApplicationCard.vue`)

## 🚀 Deployment

### Netlify/Vercel
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set up environment variables if needed

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize hosting: `firebase init hosting`
3. Build and deploy: `npm run build && firebase deploy`

## 📝 Best Practices Implemented

- **Vue 3 Composition API**: Modern reactive patterns
- **Component Reusability**: Modular, reusable components
- **Error Handling**: Proper try-catch blocks for async operations
- **Loading States**: User feedback during data operations
- **Form Validation**: Client-side validation with visual feedback
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Performance**: Computed properties and efficient re-rendering

## 🤝 Contributing

This project is designed as a portfolio piece, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for internship seekers everywhere!