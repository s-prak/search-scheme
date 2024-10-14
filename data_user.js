const axios = require('axios');
const crypto = require('crypto');

// Key and IV for AES decryption (should match the key and IV used for encryption)
const AES_KEY = Buffer.from('cf1b286cfae70ed6d0bed408f43518a87b255ccd6d84e886192d33d823527a5c', 'hex'); // Ensure this is in hex format
const AES_IV = Buffer.from('99783ad2307795bdcdda776e233a976d', 'hex'); // Ensure this is in hex format

// Helper function to decrypt an encrypted document
function decryptDocument(encryptedDocument) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let decrypted = decipher.update(encryptedDocument, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Data User submits a search query
const searchQuery = async (searchTerm) => {
  try {
    const response = await axios.post('http://localhost:3000/search', {
      searchTerm
    });

    // Check if a best match was found
    if (response.data.documentName && response.data.encryptedDocument) {
      // Decrypt the found document
      const decryptedDocument = decryptDocument(response.data.encryptedDocument);
      console.log(`Best match document: ${response.data.documentName}`);
      console.log(`Decrypted Document: ${decryptedDocument}`);
      console.log(`Match Count: ${response.data.matchCount}`);
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error('Error searching for keyword:', error.response ? error.response.data : error.message);
  }
};

// Example search
searchQuery("data");
