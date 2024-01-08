import PropTypes from "prop-types";

const SliderItem = ({ imageUrl, altText, title, description, buttonText, buttonLink }) => {
  if (!imageUrl) {
    console.error("imageUrl for SliderItem is undefined or empty!");
    return <div className="slider-item error">Missing Image</div>;
  }

  return (
    <div className="slider-item fade">
      <div className="slider-image">
        <img 
          src={imageUrl} 
          className="img-fluid"
          loading="lazy" 
          alt={altText || "slider image"} 
        />
      </div>
      <div className="container">
        <p className="slider-title">{title}</p>
        <h2 className="slider-heading">{description}</h2>
        <a href={buttonLink || "#"} className="btn btn-lg btn-primary">
          {buttonText || "Learn More"}
        </a>
      </div>
    </div>
  );
};

SliderItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string
};

export default SliderItem;
