import React, { useEffect, useState } from 'react';
import { firestore } from '../Admin/firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import '../Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 6 months ago filter
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Query Firestore to get posts from the last 6 months
        const q = query(
          collection(firestore, 'posts'),
          orderBy('timestamp', 'desc'),  // Order by timestamp, most recent first
          where('timestamp', '>=', sixMonthsAgo)  // Only posts from the last 6 months
        );

        const querySnapshot = await getDocs(q);

        const postsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Check if no posts were fetched
        if (postsArray.length === 0) {
          setError('No posts found from the last 6 months.');
        } else {
          setPosts(postsArray);
        }
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error(err);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  return (
    <div className="home">
      {error && <p>{error}</p>} {/* Display error if there is one */}
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post-item">
            <h2>{post.title}</h2>
            {/* Render content as HTML */}
            <p dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.imageURL && <img src={post.imageURL} alt={post.title} />}
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
