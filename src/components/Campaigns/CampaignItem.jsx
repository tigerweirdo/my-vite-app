import PropTypes from 'prop-types';
import "./CampaignItem.css"; // CSS dosyasını dahil et

const CampaignItem = ({ campaign }) => {
  const { imageUrl, title, description, link } = campaign || {};

  // Komponentin class isimlerini güncelle
  return (
    <div className="campaign-item" style={{ backgroundImage: `url(${imageUrl})` }}>
      <h3 className="campaign-title">{title}</h3>
      <p className="campaign-desc">{description}</p>
      <a href={link} className="btn btn-primary">View All<i className="bi bi-arrow-right"></i></a>
    </div>
  );
};

CampaignItem.propTypes = {
  campaign: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string
  })
};

export default CampaignItem;
