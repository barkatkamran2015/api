import React, { useEffect, useState } from "react";
import { auth, firestore } from "./firebaseConfig";

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await firestore.collection("users").doc(user.uid).get();
        setIsAdmin(userDoc.exists && userDoc.data().role === "admin");
      }
    };

    checkAdmin();
  }, []);

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Panel Content Here</div>;
};

export default AdminPanel;
