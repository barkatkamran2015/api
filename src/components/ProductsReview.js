import React, { useEffect, useState } from 'react';
import { firestore } from '../Admin/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../ProductsReview.css';

const ProductsReview = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Query Firestore for posts where the page is 'Products Review'
        const q = query(collection(firestore, 'posts'), where('page', '==', 'Products Review'));
        const querySnapshot = await getDocs(q);
        
        const postsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postsArray);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="products-review">
      <h2>Products Review</h2>
      {error && <p>{error}</p>}
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map(post => (
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
