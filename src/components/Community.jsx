import React from 'react';

function Community({ posts = [] }) {
  return (
    <div className="community-section">
      <h2 className="section-title"><i className="fa-solid fa-users"></i> Comunidad</h2>
      <div className="community-list">
        {posts.map((post) => (
          <div className="community-post" key={post.id}>
            <div className="post-avatar">{post.author.charAt(0).toUpperCase()}</div>
            <div className="post-body">
              <div className="post-meta">
                <strong>{post.author}</strong>
                <span className="post-time">{post.time}</span>
              </div>
              <p className="post-text">{post.content}</p>
              <div className="post-actions">
                <span><i className="fa-regular fa-heart"></i> {post.likes}</span>
                <span><i className="fa-regular fa-message"></i> {post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
