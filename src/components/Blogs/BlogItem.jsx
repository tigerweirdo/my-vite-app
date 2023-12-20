import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import "./BlogItem.css";

const BlogItem = ({ blog }) => {
  return (
    <li className="blog-item">
      <Link to={`/blog/${blog._id}`}>
        <div className="blog-image">
          <img src={blog.imageUrl} alt={blog.title} />
        </div>
        <div className="blog-info">
         
          <div className="blog-info-center">
            <h3>{blog.title}</h3>
          </div>
          <div className="blog-info-bottom">
            <span>Read More</span>
          </div>
        </div>
      </Link>
    </li>
  );
};
export default BlogItem;

BlogItem.propTypes = {
  blog: PropTypes.object.isRequired
};
