const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://todo-client.onrender.com',
  /^https:\/\/todo-client-.*\.onrender\.com$/,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Database setup
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'todos.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  // Todos table with enhanced features
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      category TEXT DEFAULT 'General',
      priority TEXT DEFAULT 'Medium',
      due_date TEXT,
      reminder_date TEXT,
      color TEXT DEFAULT '#ffffff',
      is_pinned BOOLEAN DEFAULT 0,
      is_archived BOOLEAN DEFAULT 0,
      labels TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert some demo todos
  db.get('SELECT COUNT(*) as count FROM todos', (err, row) => {
    if (err) {
      console.error('Error checking todos count:', err);
      return;
    }
    
    if (row.count === 0) {
      const demoTodos = [
        {
          text: 'Welcome to your Todo App! 🎉',
          category: 'General',
          priority: 'High',
          color: '#4CAF50',
          is_pinned: 1
        },
        {
          text: 'Click the + button to add new todos',
          category: 'General',
          priority: 'Medium',
          color: '#2196F3'
        },
        {
          text: 'Organize todos with categories and priorities',
          category: 'Work',
          priority: 'Medium',
          color: '#FF9800'
        },
        {
          text: 'Pin important todos to keep them at the top',
          category: 'Personal',
          priority: 'Low',
          color: '#9C27B0'
        }
      ];

      demoTodos.forEach(todo => {
        const now = new Date().toISOString();
        db.run(
          'INSERT INTO todos (text, category, priority, color, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [todo.text, todo.category, todo.priority, todo.color, todo.is_pinned, now, now]
        );
      });
      console.log('Demo todos inserted successfully');
    }
  });
});

// Routes

// Get all todos
app.get('/api/todos', (req, res) => {
  const { category, priority, search, completed, is_pinned, is_archived, sortBy = 'updated_at', sortOrder = 'DESC' } = req.query;
  
  let query = 'SELECT * FROM todos';
  let params = [];
  let whereClause = [];
  
  // Add filters
  if (category && category !== 'All') {
    whereClause.push('category = ?');
    params.push(category);
  }
  
  if (priority && priority !== 'All') {
    whereClause.push('priority = ?');
    params.push(priority);
  }
  
  if (search) {
    whereClause.push('text LIKE ?');
    params.push(`%${search}%`);
  }
  
  if (completed !== undefined) {
    whereClause.push('completed = ?');
    params.push(completed === 'true' ? 1 : 0);
  }

  if (is_pinned !== undefined) {
    whereClause.push('is_pinned = ?');
    params.push(is_pinned === 'true' ? 1 : 0);
  }

  if (is_archived !== undefined) {
    whereClause.push('is_archived = ?');
    params.push(is_archived === 'true' ? 1 : 0);
  }
  
  if (whereClause.length > 0) {
    query += ' WHERE ' + whereClause.join(' AND ');
  }
  
  // Add sorting (pinned items first, then by specified sort)
  query += ` ORDER BY is_pinned DESC, ${sortBy} ${sortOrder}`;
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM todos ORDER BY category', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const categories = ['All', ...rows.map(row => row.category)];
    res.json(categories);
  });
});

// Create new todo
app.post('/api/todos', (req, res) => {
  const { text, category = 'General', priority = 'Medium', due_date, reminder_date, color = '#ffffff', is_pinned = false, labels } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required' });
  }

  const now = new Date().toISOString();
  db.run(
    'INSERT INTO todos (text, category, priority, due_date, reminder_date, color, is_pinned, labels, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [text.trim(), category, priority, due_date, reminder_date, color, is_pinned ? 1 : 0, JSON.stringify(labels || []), now, now],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the newly created todo
      db.get('SELECT * FROM todos WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json(row);
      });
    }
  );
});

// Update todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed, category, priority, due_date, reminder_date, color, is_pinned, labels, is_archived } = req.body;

  const updates = [];
  const params = [];
  
  if (text !== undefined) {
    updates.push('text = ?');
    params.push(text.trim());
  }
  
  if (completed !== undefined) {
    updates.push('completed = ?');
    params.push(completed ? 1 : 0);
  }
  
  if (category !== undefined) {
    updates.push('category = ?');
    params.push(category);
  }
  
  if (priority !== undefined) {
    updates.push('priority = ?');
    params.push(priority);
  }
  
  if (due_date !== undefined) {
    updates.push('due_date = ?');
    params.push(due_date);
  }

  if (reminder_date !== undefined) {
    updates.push('reminder_date = ?');
    params.push(reminder_date);
  }

  if (color !== undefined) {
    updates.push('color = ?');
    params.push(color);
  }

  if (is_pinned !== undefined) {
    updates.push('is_pinned = ?');
    params.push(is_pinned ? 1 : 0);
  }

  if (labels !== undefined) {
    updates.push('labels = ?');
    params.push(JSON.stringify(labels));
  }

  if (is_archived !== undefined) {
    updates.push('is_archived = ?');
    params.push(is_archived ? 1 : 0);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  updates.push('updated_at = ?');
  params.push(new Date().toISOString());
  params.push(id);
  
  const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`;
  
  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Get the updated todo
    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    });
  });
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple Todo API is running' });
});

app.listen(PORT, () => {
  console.log(`Simple Todo Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
