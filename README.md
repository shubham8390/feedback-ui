# Feedback Viewer Dashboard

A modern, responsive feedback management system built with Next.js and TypeScript. This application provides a comprehensive dashboard for viewing, creating, and managing user feedback with AI-powered analysis capabilities.

##  Features

### Core Functionality
- **Feedback Management**: Create, view, and update feedback entries
- **Status Tracking**: Manage feedback with three status types: Pending, Resolved, and Archived
- **Real-time Filtering**: Filter feedback by status with instant results
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices

### Advanced Features
- **AI-Powered Analysis**: Get intelligent summaries of feedback using AI integration
- **Modal-based Interface**: Clean, intuitive modals for creating and editing feedback
- **Toast Notifications**: Real-time success and error notifications
- **Loading States**: Smooth loading indicators for better user experience

### User Interface
- **Modern Design**: Clean, professional interface using Tailwind CSS
- **Status Indicators**: Color-coded status badges for easy identification
- **Responsive Table**: Adaptive table layout that works across all screen sizes
- **Interactive Elements**: Hover effects and smooth transitions

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.3.5**: React framework with App Router
- **React 19.0.0**: Latest version with modern features
- **TypeScript 5.8.3**: Type-safe development

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **Geist Font**: Modern, clean typography from Vercel
- **Responsive Design**: Mobile-first approach with breakpoint utilities

### State Management & UI Components
- **React Hooks**: useState, useEffect for state management
- **React Hot Toast**: Toast notification system
- **Custom Modal Component**: Reusable modal implementation

### Development Tools
- **ESLint**: Code linting with Next.js and TypeScript rules
- **PostCSS**: CSS processing with Tailwind integration
- **TypeScript**: Static type checking and IntelliSense

## 📁 Project Structure

```
feedback-ui/
├── src/
│   └── app/
│       ├── component/
│       │   └── dashboard.tsx      # Main dashboard component
│       ├── globals.css            # Global styles with Tailwind
│       ├── layout.tsx             # Root layout with fonts and Toaster
│       └── page.tsx               # Home page component
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── postcss.config.mjs             # PostCSS configuration
└── eslint.config.mjs              # ESLint configuration
```

This README.md provides a comprehensive overview of your Feedback Viewer Dashboard project, including:

1. **Detailed feature list** - All the functionality your app provides
2. **Complete technology stack** - Every technology and library used
3. **Project structure** - Clear file organization
4. **Installation instructions** - Step-by-step setup guide
5. **API integration details** - How the app connects to the backend
6. **UI/UX features** - Design system and responsive design details
7. **Security and performance** - Technical considerations
8. **Contributing guidelines** - For future development

The README is structured to be both informative for developers and accessible for stakeholders who want to understand what the project does and how it's built.

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feedback-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Integration

The application integrates with a RESTful API for feedback management:

### API Endpoints
- `GET /feedbacks` - Fetch all feedback entries
- `POST /feedbacks/add` - Create new feedback
- `PATCH /feedbacks/{id}/status` - Update feedback status
- `POST /feedbacks/summary` - Generate AI summary

### Authentication
- API Key-based authentication using `x-api-key` header
- Secure communication with HTTPS endpoints

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Consistent color scheme with semantic status colors
- **Typography**: Geist font family for modern, readable text
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Shadows**: Subtle shadows for depth and hierarchy

### Responsive Breakpoints
- **Mobile**: Optimized for screens < 640px
- **Tablet**: Responsive design for 640px - 1024px
- **Desktop**: Full-featured interface for > 1024px

### Interactive Elements
- **Hover Effects**: Subtle color transitions on interactive elements
- **Focus States**: Accessible focus indicators
- **Loading States**: Spinner animations during API calls
- **Toast Notifications**: Non-intrusive success/error messages

## 🔒 Security Features

- **API Key Authentication**: Secure API communication
- **Input Validation**: Client-side form validation
- **Error Handling**: Graceful error handling with user feedback
- **Type Safety**: TypeScript for compile-time error prevention

## 🚀 Performance Optimizations

- **Next.js App Router**: Modern routing with automatic code splitting
- **Tailwind CSS**: Optimized CSS with PurgeCSS
- **Lazy Loading**: Components load only when needed
- **Efficient State Management**: Minimal re-renders with React hooks

##  Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Acknowledgments

- **Vercel** for Next.js framework
- **Tailwind Labs** for the CSS framework
- **React Hot Toast** for notification system
- **Geist Font** by Vercel for typography

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**