import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; 
import Loading from './Loading';

function PostDetail() {
  const { slug } = useParams();  // extrae el slug de la URL
  console.log('Slug actual:', slug);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
const API_URL = process.env.REACT_APP_API_URL || 'https://blog-backend-production-ee19.up.railway.app';

  useEffect(() => {
    fetch(`${API_URL}/posts/${slug}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Post no encontrado');
        }
        return response.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [slug]);
  
  if (loading) {
    return <Loading />;
  }
  
  if (!post) {
    return (
      <div className="App">
        <p>Post no encontrado</p>
        <Link to="/">← Volver al inicio</Link>
      </div>
    );
  }
  
  return (
    <div className="App">
      <Link to="/" className="back-link">← Volver al inicio</Link>
      
      <article className="post-detail">
        <header>
          <span className="category-badge">{post.category.name}</span>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <small>Publicado el {new Date(post.created_at + 'Z').toLocaleDateString('es-AR')}</small>
            <small>Última actualización: {new Date(post.updated_at + 'Z').toLocaleDateString('es-AR')}</small>
          </div>
        </header>
        
        <div className="post-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

export default PostDetail;