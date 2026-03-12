import React, { useState } from 'react';
import './Gallery.css';

const VIDEOS = [
  {
    id: 1,
    title: 'Morning Yoga Flow',
    description: 'A 15-minute gentle yoga flow to start your day with energy and focus.',
    url: '/videos/yoga_morning.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    duration: '15:20',
    category: 'Yoga'
  },
  {
    id: 2,
    title: 'HIIT Cardio Blast',
    description: 'High-intensity interval training to burn fat and improve cardiovascular health.',
    url: '/videos/hiit_cardio.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    duration: '25:45',
    category: 'HIIT'
  },
  {
    id: 3,
    title: 'Full Body Strength',
    description: 'Comprehensive strength training targeting all major muscle groups.',
    url: '/videos/strength_fullbody.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    duration: '45:00',
    category: 'Strength'
  },
  {
    id: 4,
    title: 'Core & Abs Intensive',
    description: 'Focused exercises to strengthen your core and define your abdominal muscles.',
    url: '/videos/core_abs.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    duration: '12:30',
    category: 'Core'
  },
  {
    id: 5,
    title: 'Cool Down & Stretch',
    description: 'Essential stretches to improve flexibility and aid recovery after workouts.',
    url: '/videos/cooldown.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    duration: '10:15',
    category: 'Recovery'
  }
];

export default function Gallery() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(VIDEOS.map(v => v.category))];
  
  const filteredVideos = activeCategory === 'All' 
    ? VIDEOS 
    : VIDEOS.filter(v => v.category === activeCategory);

  return (
    <div className="gallery-page crimson-theme">
      <div className="gallery-container">
        <header className="gallery-header">
          <div className="header-badge">EXCLUSIVE ACCESS</div>
          <h1>Training Archive</h1>
          <p>Tactical instructionals and elite training protocols.</p>
        </header>

        <div className="gallery-filters">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredVideos.map(video => (
            <div key={video.id} className="video-card" onClick={() => setSelectedVideo(video)}>
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <div className="video-overlay">
                  <div className="play-icon">
                    <i className="bi bi-play-fill"></i>
                  </div>
                  <span className="video-duration">{video.duration}</span>
                </div>
              </div>
              <div className="video-info">
                <span className="video-category">{video.category}</span>
                <h3 className="video-title">{video.title}</h3>
                <p className="video-desc">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedVideo && (
          <div className="video-modal" onClick={() => setSelectedVideo(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setSelectedVideo(null)}>
                <i className="bi bi-x"></i>
              </button>
              <div className="video-player-container">
                <video controls autoPlay className="video-player">
                  <source src={selectedVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="modal-info">
                <h2>{selectedVideo.title}</h2>
                <p>{selectedVideo.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
