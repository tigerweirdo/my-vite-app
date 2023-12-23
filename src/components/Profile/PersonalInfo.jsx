import  { useState } from 'react';
import './Profile.css';

const UserProfile = () => {
    // Mevcut kullanıcı bilgilerini tutan state
    const [user,] = useState({
        username: 'KullanıcıAdı',
        email: 'email@example.com',
        avatar: 'https://via.placeholder.com/150'
    });

    
   
    return (
        <div className="user-profile">
         <div className="user-details">
                
                        <h2 className="user-name">{user.username}</h2>
                        <p className="user-email">{user.email}</p>
                        <div className="user-avatar">
                            <img src={user.avatar} alt="User Avatar" />
                        </div>
                        <button className="edit-button">Profili Düzenle</button>
                
            </div>
        </div>
    );
};

export default UserProfile;
