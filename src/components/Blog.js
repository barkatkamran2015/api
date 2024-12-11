import React, { useEffect, useState } from 'react';
import { firestore } from '../Admin/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Header'; // Import Header component
import '../Blog.css'; // Import the CSS file from the root directory

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Query Firestore for posts where the page is 'Blog'
        const q = query(collection(firestore, 'posts'), where('page', '==', 'Blog'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('No posts found.');
        }

        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postsArray);
        setFilteredPosts(postsArray);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="blog">
      {/* Include the Header with search */}
      <Header onSearch={handleSearch} />

      {error && <p>{error}</p>}
      {filteredPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        filteredPosts.map((post) => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.imageURL && <img src={post.imageURL} alt={post.title} />}
          </div>
        ))
      )}
    </div>
  );
};

export default Blog;
