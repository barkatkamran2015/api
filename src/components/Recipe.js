import React, { useEffect, useState } from 'react';
import { firestore } from '../Admin/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../Recipe.css'; // Import the Recipe.css file

const Recipe = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Query Firestore for posts where the page is 'Recipe'
        const q = query(collection(firestore, 'posts'), where('page', '==', 'Recipe'));
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
    <div className="recipe">
      <h2>Recipe</h2>
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

export default Recipe;
