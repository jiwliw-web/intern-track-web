// Firebase configuration and service functions
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjo4XG8ZX872oagaenZhKmxvQgii2czrM",
  authDomain: "interntrack-b7024.firebaseapp.com",
  projectId: "interntrack-b7024",
  storageBucket: "interntrack-b7024.firebasestorage.app",
  messagingSenderId: "262366428246",
  appId: "1:262366428246:web:f0a019b650a3d0e31d0ff7",
  measurementId: "G-Q27DJKRPN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore service functions
export const firestoreService = {
  // Add new application
  async addApplication(applicationData) {
    try {
      const docRef = await addDoc(collection(db, "applications"), {
        ...applicationData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding application:", error);
      throw error;
    }
  },

  // Get all applications
  async getApplications() {
    try {
      const q = query(collection(db, "applications"), orderBy("appliedDate", "desc"));
      const querySnapshot = await getDocs(q);
      const applications = [];
      
      querySnapshot.forEach((doc) => {
        applications.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return applications;
    } catch (error) {
      console.error("Error getting applications:", error);
      throw error;
    }
  },

  // Update application
  async updateApplication(id, applicationData) {
    try {
      const applicationRef = doc(db, "applications", id);
      await updateDoc(applicationRef, {
        ...applicationData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  },

  // Delete application
  async deleteApplication(id) {
    try {
      await deleteDoc(doc(db, "applications", id));
    } catch (error) {
      console.error("Error deleting application:", error);
      throw error;
    }
  }
};