import React from 'react';

const avatarColors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];

function Community({ posts = [] }) {
  const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  return (
    <div className="community-section">
      <h2 className="section-title"><i className="fa-solid fa-comments"></i> Comunidad</h2>
      <div className="community-list">
        {posts.map((post) => (
          <div className="community-post" key={post.id}>
            <div 
              className="post-avatar" 
              style={{ backgroundColor: getAvatarColor(post.author) }}
            >
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div className="post-body">
              <div className="post-meta">
                <strong className="post-author">{post.author}</strong>
                <span className="post-time">{post.time}</span>
              </div>
              <p className="post-text">{post.content}</p>
              <div className="post-actions">
                <button className="action-btn">
                  <i className="fa-regular fa-heart"></i> {post.likes}
                </button>
                <button className="action-btn">
                  <i className="fa-regular fa-comment"></i> {post.comments}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
