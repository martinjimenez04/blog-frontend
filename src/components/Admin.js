import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://blog-backend-production-ee19.up.railway.app';

function Admin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Cargar TODOS los posts (incluyendo borradores)
    fetch(`${API_URL}/posts?published_only=false`)
      .then(async res => {
        if (!res.ok) {
          throw new Error(`Error al cargar posts (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('No se pudo cargar el panel de posts.');
        setLoading(false);
      });
  }, []);
  
  const handleDelete = async (slug) => {
    if (!window.confirm('¿Estás seguro de eliminar este post?')) return;
    
    try {
      const response = await fetch(`${API_URL}/posts/${slug}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Actualizar la lista sin recargar
        setPosts(posts.filter(post => post.slug !== slug));
        alert('Post eliminado correctamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el post');
    }
  };
  
  const togglePublished = async (post) => {
    try {
      const response = await fetch(`${API_URL}/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published })
      });
      
      if (response.ok) {
        const updated = await response.json();
        setPosts(posts.map(p => p.slug === post.slug ? updated : p));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el post');
    }
  };
  
  if (loading) {
    return <div className="admin-container"><p>Cargando...</p></div>;
  }
  
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <Link to="/admin/new" className="btn btn-primary">+ Nuevo Post</Link>
      </div>
      {error && <p>{error}</p>}
      
      <div className="admin-posts">
        {posts.length === 0 ? (
          <p>No hay posts todavía.</p>
        ) : (
          <table className="posts-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/posts/${post.slug}`} target="_blank">
                      {post.title}
                    </Link>
                  </td>
                  <td>{post.category?.name || 'Sin categoria'}</td>
                  <td>
                    <button 
                      onClick={() => togglePublished(post)}
                      className={`status-badge ${post.published ? 'published' : 'draft'}`}
                    >
                      {post.published ? '✓ Publicado' : '○ Borrador'}
                    </button>
                  </td>
                  <td>{new Date(post.created_at + 'Z').toLocaleDateString('es-AR')}</td>
                  <td className="actions">
                    <Link to={`/admin/edit/${post.slug}`} className="btn btn-small">
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDelete(post.slug)}
                      className="btn btn-small btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Admin;