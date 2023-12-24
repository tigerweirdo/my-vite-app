import PropTypes from "prop-types";

const SliderItem = ({ imageUrl, altText, title, description, buttonText, buttonLink }) => {
  if (!imageUrl) {
    console.error("imageUrl for SliderItem is undefined or empty!");
    return <div className="slider-item error">Missing Image</div>;
  }

  // Append dynamic resizing parameters to the imageUrl
  const width = 800; // or dynamically calculate based on the container or viewport size
  const height = 450; // adjust as needed for your aspect ratio
  const dynamicImageUrl = `${imageUrl}?w=${width}&h=${height}&fit=crop`; // Adjust the parameters based on your image service

  return (
    <div className="slider-item fade">
      <div className="slider-image">
        <img 
          src={dynamicImageUrl} 
          className="img-fluid1" 
          loading="lazy" 
          alt={altText || "slider image"} />
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
