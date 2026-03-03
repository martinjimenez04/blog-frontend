# Blog Frontend

Modern personal blog built with React and React Router, featuring a full admin panel and Markdown support.

## Stack

- **React** — UI library
- **React Router** — Client-side routing
- **react-markdown** — Markdown rendering
- **CSS3** — Responsive styling

## Features

### Public Blog
- ✅ Post list with preview cards
- ✅ Individual post view with full Markdown rendering
- ✅ Real-time search functionality
- ✅ Category filters with post counts
- ✅ Responsive design for all devices
- ✅ Loading states with spinner animation

### Admin Panel
- ✅ Complete CRUD operations for posts
- ✅ Create and edit posts with Markdown preview
- ✅ Toggle publish/draft status
- ✅ Delete posts with confirmation
- ✅ Auto-generate URL slugs from titles
- ✅ Category assignment

### Content
- ✅ **Markdown support** with syntax highlighting for code blocks
- ✅ Support for headings, lists, quotes, links, and images
- ✅ Clean typography and formatting

## Installation
```bash
npm install
```

## Environment Variables

Create a `.env` file (optional for development):
```env
REACT_APP_API_URL=http://localhost:8000
```

## Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Production Build
```bash
npm run build
```

## Project Structure
```
src/
├── components/
│   ├── Header.js          # Site header with navigation
│   ├── PostList.js        # Main blog page with search and filters
│   ├── PostDetail.js      # Individual post view
│   ├── Admin.js           # Admin panel post list
│   ├── PostForm.js        # Create/edit post form
│   └── Loading.js         # Loading spinner component
├── App.js                 # Main app with routing
├── App.css                # Global styles
└── index.js               # Entry point
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | PostList | Blog home with all posts |
| `/posts/:slug` | PostDetail | Individual post page |
| `/admin` | Admin | Admin panel - manage posts |
| `/admin/new` | PostForm | Create new post |
| `/admin/edit/:slug` | PostForm | Edit existing post |

## Backend

This frontend connects to: [blog-backend](https://github.com/martinjimenez04/blog-backend)

Backend must be running on `http://localhost:8000` for local development.

## Demo Features

**Search:** Type in the search bar to filter posts by title or content in real-time

**Category Filters:** Click category buttons to view posts from specific categories

**Admin Panel:** Navigate to `/admin` to manage posts (create, edit, delete, toggle publish status)

**Markdown:** Posts support full Markdown syntax including headings, lists, code blocks, quotes, and links

## Author

**Martin Jimenez**  
Information Systems Engineering Student - UTN FRC

GitHub: [@martinjimenez04](https://github.com/martinjimenez04)