import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

  export const putDb = async (content) => {
    console.log('Storing content in the database');
  
    try {
      // Create a connection to the database and specify the version to use
      const jateDB = await openDB('jate', 1);
  
      // Create a new transaction and specify read/write access
      const transaction = jateDB.transaction('jate', 'readwrite');
  
      // Access the object store
      const store = transaction.objectStore('jate');
  
      // Use the put method to store the data (IndexedDB will auto-generate a key)
      const key = await store.put({ content }); // Store content as an object
  
      console.log(`Content stored with key: ${key}`);
    } catch (error) {
      console.error('Error storing content:', error);
    }
  };

  export const getDb = async () => {
    console.log('GET from the database');
  
    try {
      // Create a connection to the database and specify the version to use
      const jateDB = await openDB('jate', 1);
  
      // Create a new transaction and specify the database and data privileges
      const tx = jateDB.transaction('jate', 'readonly');
  
      // Access the object store
      const store = tx.objectStore('jate');
  
      // Use the .getAll() method to get all data in the database
      const request = store.getAll();
  
      // Get confirmation of the request
      const result = await request;
      console.log('Retrieved data:', result);
      return result;
    } catch (error) {
      console.error('Error getting data from the database:', error);
      return null; // Handle the error gracefully
    }
  };

initdb();

