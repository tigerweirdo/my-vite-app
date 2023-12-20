import  { useEffect, useState } from 'react';
import BlogItem from "./BlogItem";
import "./Blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/blog`); // String template kullanılarak apiUrl değişkeni ekleniyor
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Blogları çekerken hata oluştu', error);
      }
    };

    fetchBlogs();
  }, [apiUrl]); // apiUrl değişkenini useEffect hook'unun bağımlılıkları arasına ekleyin

  return (
    <section className="blogs">
      <div className="container">
        <div className="section-title">
          <h2>From Our Blog</h2>
          <p>Summer Collection New Modern Design</p>
        </div>
        <ul className="blog-list">
          {blogs.map(blog => (
            <BlogItem key={blog._id} blog={blog} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Blogs;
