import React, { useEffect, useState } from 'react';
import { firestore } from '../Admin/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Header'; // Import Header component
import '../ProductsReview.css';
import '../Header.css';

const ProductsReview = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const q = query(collection(firestore, 'posts'), where('page', '==', 'Products Review'));
        const querySnapshot = await getDocs(q);

        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          tags: doc.data().tags || [],
        }));

        setPosts(postsArray);
        setFilteredPosts(postsArray);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
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
    <div className="products-review">
      <Header onSearch={handleSearch} />
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        filteredPosts.map((post) => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.imageURL && <img src={post.imageURL} alt="Post" />}
          </div>
        ))
      )}
    </div>
  );
};

export default ProductsReview;
