import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import Admin from './components/Admin';          
import PostForm from './components/PostForm';    
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:slug" element={<PostDetail />} />
            <Route path="/admin" element={<Admin />} />              
            <Route path="/admin/new" element={<PostForm />} />       
            <Route path="/admin/edit/:slug" element={<PostForm />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;