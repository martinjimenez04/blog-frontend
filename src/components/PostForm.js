import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = (process.env.REACT_APP_API_URL || 'https://blog-backend-production-ee19.up.railway.app').replace(/\/$/, '');

function PostForm() {
  const navigate = useNavigate();
  const { slug } = useParams();  // Si existe, estamos editando
  const isEditing = !!slug;
  
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    published: false
  });
  const [loading, setLoading] = useState(isEditing);
  
  // Cargar categorías
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`No se pudieron cargar categorias (${res.status}): ${errorText}`);
        }
        return res.json();
      })
      .then(data => {
        setCategories(data);
        if (data.length === 0) {
          setCategoriesError('No hay categorias creadas en la base de datos. Crea al menos una categoria antes de publicar un post.');
        } else {
          setCategoriesError('');
        }
      })
      .catch(error => {
        console.error('Error al cargar categorias:', error);
        setCategoriesError('Error al cargar categorias desde el backend. Revisa CORS, URL de API y logs del servidor.');
      })
      .finally(() => setCategoriesLoading(false));
  }, []);
  
  // Si estamos editando, cargar el post
  useEffect(() => {
    if (isEditing) {
      fetch(`${API_URL}/posts/${slug}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            category_id: data.category_id,
            published: data.published
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error al cargar el post');
          navigate('/admin');
        });
    }
  }, [slug, isEditing, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Auto-generar slug desde el título
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quitar tildes
      .replace(/[^a-z0-9]+/g, '-')  // reemplazar espacios y símbolos por guiones
      .replace(/^-+|-+$/g, '');  // quitar guiones al inicio/fin
    
    setFormData(prev => ({ ...prev, slug }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isEditing 
      ? `${API_URL}/posts/${slug}`
      : `${API_URL}/posts`;
    
    const method = isEditing ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert(isEditing ? 'Post actualizado' : 'Post creado correctamente');
        navigate('/admin');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el post');
    }
  };
  
  if (loading) {
    return <div className="admin-container"><p>Cargando...</p></div>;
  }
  
  return (
    <div className="admin-container">
      <h1>{isEditing ? 'Editar Post' : 'Crear Nuevo Post'}</h1>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <button 
            type="button" 
            onClick={generateSlug}
            className="btn btn-small"
          >
            Generar slug desde título
          </button>
        </div>
        
        <div className="form-group">
          <label>Slug (URL) *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="mi-primer-post"
            required
          />
          <small>Este será la URL: /posts/{formData.slug || 'slug-del-post'}</small>
        </div>
        
        <div className="form-group">
          <label>Categoría *</label>
          {categoriesLoading && <small>Cargando categorias...</small>}
          {categoriesError && <small style={{ color: 'crimson', display: 'block', marginBottom: '8px' }}>{categoriesError}</small>}
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            disabled={categoriesLoading || categories.length === 0}
          >
            <option value="">Seleccionar categoría...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Resumen (excerpt) *</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            placeholder="Resumen corto que aparece en la lista..."
            required
          />
        </div>
        
        <div className="form-group">
          <label>Contenido (Markdown) *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="15"
            placeholder="# Título

Escribe tu contenido en Markdown..."
            required
          />
          <small>
            Soporta Markdown: **negrita**, *cursiva*, `código`, etc.
          </small>
        </div>
        
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            Publicar inmediatamente
          </label>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={categoriesLoading || categories.length === 0}
          >
            {isEditing ? 'Actualizar Post' : 'Crear Post'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin')}
            className="btn"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;