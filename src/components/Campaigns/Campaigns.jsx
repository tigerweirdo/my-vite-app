import { useState, useEffect } from 'react';
import CampaignItem from "./CampaignItem";
import "./Campaigns.css";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  // Fetch the campaign data when the component mounts
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/campaign'); // Adjust with your API endpoint
        const data = await response.json();
        setCampaigns(data.slice(0, 2)); // Store only the first two campaigns
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <section className="campaigns">
      <div className="container2">
        <div className="campaigns-wrapper">
          {campaigns.map((campaign, index) => (
            <CampaignItem key={index} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
