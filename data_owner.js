const axios = require('axios');
const crypto = require('crypto');

// Key and IV for AES encryption
const AES_KEY = crypto.randomBytes(32); // 256-bit key
const AES_IV = crypto.randomBytes(16);  // 128-bit IV

// Function to encrypt a document
function encryptDocument(plaintext) {
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Example documents and their keywords
const documents = [
  {
    name: "Doc1",
    text: "This is a secret document containing sensitive information.",
    keywords: ["secret", "sensitive", "document"]
  },
  {
    name: "Doc2",
    text: "Another document that discusses sensitive topics.",
    keywords: ["sensitive", "topics", "discusses"]
  },
  {
    name: "Doc3",
    text: "This document is about data encryption and security.",
    keywords: ["encryption", "security", "data"]
  }
];

// Function to submit multiple documents
const submitIndexes = async () => {
  for (const doc of documents) {
    const encryptedDocument = encryptDocument(doc.text);
    try {
      const response = await axios.post('http://localhost:3000/submit-index', {
        documentName: doc.name,
        encryptedDocument,
        keywords: doc.keywords
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting index:', error.response.data);
    }
  }
};

submitIndexes();

// In data_owner.js, after generating the keys
console.log('AES_KEY:', AES_KEY.toString('hex')); // Log the key
console.log('AES_IV:', AES_IV.toString('hex'));   // Log the IV
