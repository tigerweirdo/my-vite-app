import "./CampaignItem.css";

const CampaignItem = () => {
  // Placeholder for dynamic image URL, use props or state as needed
  const imageUrl = "path/to/your/image.jpg"; // replace with actual image path or URL
  return (
    <div className="campaign-item">
      <div className="campaign-image-wrapper">
        <img 
          src={imageUrl} 
          className="campaign-image" 
          alt="Campaign"
          loading="lazy" // lazy load the image
        />
      </div>
      <div className="campaign-content">
        <h3 className="campaign-title">
          Fashion Month<br/>
          Ready in Capital<br/>
          Shop
        </h3>
        <p className="campaign-desc">
          Lorem ipsum dolor sit amet consectetur adipiscing elit dolor
        </p>
        <a href="#" className="btn btn-primary">
          View All
          <i className="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default CampaignItem;
