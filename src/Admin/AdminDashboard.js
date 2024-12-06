import React, { useState, useEffect } from 'react';
import { firestore, storage } from '../Admin/firebaseConfig'; // Ensure this is correctly set up
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addDoc, collection, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import DOMPurify from 'dompurify';
import '../AdminDashboard.css';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPage, setSelectedPage] = useState('Blog');
  const [imageURL, setImageURL] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState('');

  // Handles image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('No file selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('api-omega-gules.vercel.app/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const data = await response.json();
      setImageURL(data.imageUrl); // Assuming your server sends back the image URL
      setUploadProgress(0);
      setError('');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
      setUploadProgress(0);
    }
  };
  

  // Handles post submission (add/update)
  const handlePostSubmission = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    try {
      if (editMode) {
        const postRef = doc(firestore, 'posts', currentPostId);
        await updateDoc(postRef, {
          title,
          content: DOMPurify.sanitize(content),
          page: selectedPage,
          imageURL,
        });
        setSuccessMessage('Post updated successfully!');
      } else {
        await addDoc(collection(firestore, 'posts'), {
          title,
          content: DOMPurify.sanitize(content),
          page: selectedPage,
          imageURL,
          timestamp: serverTimestamp(),
        });
        setSuccessMessage('Post created successfully!');
      }
      resetForm();
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again later.');
    }
  };

  // Reset form fields after submission
  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedPage('Blog');
    setImageURL('');
    setEditMode(false);
    setCurrentPostId('');
    setUploadProgress(0);
  };

  // Fetch posts on mount and subscribe to updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'posts'),
      (snapshot) => {
        const postsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts. Please try again later.');
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle edit post
  const handleEdit = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      setError('Post not found.');
      return;
    }
    setTitle(post.title);
    setContent(post.content);
    setImageURL(post.imageURL || '');
    setSelectedPage(post.page);
    setEditMode(true);
    setCurrentPostId(postId);
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(firestore, 'posts', postId));
      setSuccessMessage('Post deleted successfully!');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again later.');
    }
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ align: [] }],
    ],
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handlePostSubmission} className="post-form">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="image-upload" />
        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div style={{ width: `${uploadProgress}%` }} className="progress-bar-fill" />
          </div>
        )}
        {imageURL && <img src={imageURL} alt="Uploaded" className="uploaded-image" />}
        <ReactQuill value={content} onChange={setContent} theme="snow" modules={modules} className="quill-editor" />
        <select value={selectedPage} onChange={(e) => setSelectedPage(e.target.value)} className="page-select">
          <option value="Blog">Blog</option>
          <option value="Products Review">Products Review</option>
          <option value="Recipe">Recipe</option>
        </select>
        <button type="submit" className="submit-button">
          {editMode ? 'Update Post' : 'Post'}
        </button>
      </form>

      <div className="posts-list">
        <h3>Recent Posts</h3>
        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <h4>{post.title}</h4>
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
              {post.imageURL && <img src={post.imageURL} alt="Post" className="post-image" />}
              <p>
                <strong>Page:</strong> {post.page}
              </p>
              <div className="buttons-container">
                <button onClick={() => handleEdit(post.id)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(post.id)} className="delete-button">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
