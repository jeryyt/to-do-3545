# Full-Stack Todo List App

A modern, responsive Todo List application built with React frontend and Node.js/Express backend, featuring a SQLite database for data persistence.

## Features

- ✨ **Create Tasks**: Add new tasks with a clean, intuitive interface
- 📋 **View Tasks**: See all your tasks with creation timestamps
- ✅ **Toggle Completion**: Mark tasks as complete/incomplete with visual feedback
- 🗑️ **Delete Tasks**: Remove completed or unwanted tasks
- 📊 **Progress Tracking**: Visual progress bar showing completion status
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile Friendly**: Optimized for all device sizes
- 🚀 **Real-time Updates**: Instant UI updates with optimistic rendering

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **CSS3** - Custom CSS with CSS variables and modern features
- **Lucide React** - Beautiful, customizable icons
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request body parsing

## Project Structure

```
todo-list-fullstack/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── TodoForm.js
│   │   │   ├── TodoList.js
│   │   │   └── TodoItem.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server & API routes
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/todos` | Retrieve all todos |
| `POST` | `/api/todos` | Create a new todo |
| `PUT` | `/api/todos/:id` | Update todo completion status |
| `DELETE` | `/api/todos/:id` | Delete a todo |
| `GET` | `/api/health` | Health check endpoint |

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd todo-list-fullstack
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Setup (Alternative)

If you prefer to install dependencies separately:

1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start servers separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

## Usage

1. **Add a Task**: Type your task in the input field and click "Add Task"
2. **Complete a Task**: Click the circle icon next to a task to mark it complete
3. **Delete a Task**: Click the "Delete" button to remove a task
4. **Track Progress**: View your completion progress in the progress bar

## Database

The app uses SQLite for data persistence. The database file (`todos.db`) is automatically created in the server directory when you first run the application.

### Database Schema

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

### Local Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run server
   ```

### Cloud Deployment

The app can be deployed to platforms like:
- **Render**: Free tier available
- **Heroku**: Free tier available
- **Railway**: Free tier available
- **Vercel**: Frontend deployment
- **Netlify**: Frontend deployment

For cloud deployment, set the `PORT` environment variable and ensure your database configuration supports the deployment environment.

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install all dependencies for the project

### Code Structure

- **Components**: Modular React components with clear separation of concerns
- **State Management**: React hooks for local state management
- **API Integration**: Fetch API for backend communication
- **Error Handling**: Comprehensive error handling with user feedback
- **Responsive Design**: Mobile-first CSS with modern features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please check the following:
1. Ensure all dependencies are installed correctly
2. Check that both frontend and backend servers are running
3. Verify the database file has proper permissions
4. Check the browser console and server logs for error messages

---

**Happy coding! 🚀**
