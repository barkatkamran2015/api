import React, { useEffect, useState } from 'react';
import { firestore } from '../Admin/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../Blog.css'; // Import the CSS file from the root directory

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(firestore, 'posts'), where('page', '==', 'Blog'));
        const querySnapshot = await getDocs(q);

        const postsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postsArray);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="blog">
      <h2>Blog</h2>
      {loading && <p>Loading posts...</p>}
      {error && <p className="error">{error}</p>}
      {posts.length === 0 && !loading && (
        <p className="no-posts">No posts available</p>
      )}
      {posts.length > 0 && !loading && posts.map(post => (
        <div key={post.id} className="post-item">
          <h3>{post.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.imageURL && <img src={post.imageURL} alt={post.title} />}
        </div>
      ))}
    </div>
  );
};

export default Blog;
