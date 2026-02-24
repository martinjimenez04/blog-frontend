import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:8000/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return <p>Cargando posts...</p>;
  }
  
  return (
    <div className="posts-list">
      {posts.length === 0 ? (
        <p>No hay posts todavía.</p>
      ) : (
        posts.map(post => (
          <Link to={`/posts/${post.slug}`} key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p className="excerpt">{post.excerpt}</p>
            <div className="post-meta">
              <span className="category">{post.category.name}</span>
              <small>{new Date(post.created_at).toLocaleDateString()}</small>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default PostList;