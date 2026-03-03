import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';

const API_URL = process.env.REACT_APP_API_URL || 'https://blog-backend-production-ee19.up.railway.app';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Cargar posts
  useEffect(() => {
    fetch(`${API_URL}/posts`)
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
  
  // Cargar categorías
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(response => response.json())
      .then(data => setCategories(data));
  }, []);
  
  // Filtrar posts por búsqueda Y categoría
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || post.category.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="search"
          placeholder="Buscar posts por título o contenido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="clear-search"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Filtro por categoría */}
      <div className="category-filters">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
        >
          Todos ({posts.length})
        </button>
        {categories.map(cat => {
          const count = posts.filter(p => p.category.id === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>
      
      {/* Lista de posts */}
      <div className="posts-list">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            {searchTerm || selectedCategory ? (
              <>
                <p>No se encontraron posts con los filtros seleccionados</p>
                <button onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}>
                  Limpiar filtros
                </button>
              </>
            ) : (
              <p>No hay posts todavía.</p>
            )}
          </div>
        ) : (
          filteredPosts.map(post => (
            <Link to={`/posts/${post.slug}`} key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p className="excerpt">{post.excerpt}</p>
              <div className="post-meta">
                <span className="category">{post.category.name}</span>
                <small>{new Date(post.created_at + 'Z').toLocaleDateString('es-AR', {timeZone: 'America/Argentina/Cordoba'})}</small>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default PostList;