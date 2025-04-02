import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from './config';

// Create a document with a specific ID
export const createDocWithId = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, createdAt: new Date() });
    return docId;
  } catch (error) {
    throw error;
  }
};

// Create a document with auto-generated ID
export const createDoc = async (collectionName, data) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, { ...data, createdAt: new Date() });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get a document by ID
export const getDocById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Get all documents from a collection
export const getAllDocs = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    throw error;
  }
};

// Query documents
export const queryDocs = async (collectionName, conditions = [], orderByField = null, limitCount = null) => {
  try {
    let collectionRef = collection(db, collectionName);
    
    // Build query with conditions
    let queryConstraints = [];
    
    if (conditions.length > 0) {
      conditions.forEach(condition => {
        queryConstraints.push(where(condition.field, condition.operator, condition.value));
      });
    }
    
    if (orderByField) {
      queryConstraints.push(orderBy(orderByField.field, orderByField.direction || 'asc'));
    }
    
    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }
    
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    throw error;
  }
};

// Update a document
export const updateDocById = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
    return true;
  } catch (error) {
    throw error;
  }
};

// Delete a document
export const deleteDocById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    throw error;
  }
};
