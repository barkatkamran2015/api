import React, { useEffect, useState } from 'react';
import { firestore } from '../Admin/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Header'; // Import Header component
import '../Recipe.css';

const Recipe = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(firestore, 'posts'),
          where('page', '==', 'Recipe') // Filter for 'Recipe' posts only
        );
        
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          console.log('No documents found');
        }
  
        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postsArray);
        setFilteredPosts(postsArray);

        // Extract unique categories and tags
        const uniqueCategories = [...new Set(postsArray.map((post) => post.category))];
        const uniqueTags = [...new Set(postsArray.flatMap((post) => post.tags))];

        setCategories(uniqueCategories);
        setTags(uniqueTags);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error(err);
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

  const handleFilterApply = (selectedCategories, selectedTags) => {
    const filtered = posts.filter(
      (post) =>
        (!selectedCategories.length || selectedCategories.includes(post.category)) &&
        (!selectedTags.length || post.tags.some((tag) => selectedTags.includes(tag)))
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="recipe">
      <Header
        onSearch={handleSearch}
        onFilterApply={handleFilterApply}
        categories={categories}
        tags={tags}
      />
      
      {loading && <p>Loading posts...</p>}

      {error && <p>{error}</p>}

      {filteredPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        filteredPosts.map((post) => (
          <div key={post.id} className="post-item">
            <h2>{post.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.imageURL && <img src={post.imageURL} alt={post.title} />}
          </div>
        ))
      )}
    </div>
  );
};

export default Recipe;
