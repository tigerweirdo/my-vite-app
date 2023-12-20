import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./BlogDetails.css";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/blog/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Blog detayları çekerken hata oluştu:', error);
      }
    };

    fetchBlogDetails();
  }, [id, apiUrl]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <section className="single-blog">
      <div className="container">
        <article>
          <figure>
            <img src={blog.imageUrl} alt={blog.title} />
          </figure>
          <div className="blog-wrapper">
            <div className="blog-meta">
              <div className="blog-category">
                
              </div>
              <div className="blog-date">
                <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleDateString()}</time>

              </div>
              <div className="blog-tags">
                
              </div>
            </div>
            <h1 className="blog-title">{blog.title}</h1>
            <div className="blog-content">
              {blog.content}
            </div>
          </div>
        </article>
       
      </div>
    </section>
  );
};

export default BlogDetails;
