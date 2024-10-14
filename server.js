const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request body

// In-memory storage for multiple documents (index)
let dataIndex = [];

// Helper function to hash keywords
function hashKeyword(keyword) {
  return crypto.createHash('sha256').update(keyword).digest('hex');
}

// Route for the Data Owner to submit the index (encrypted document and keywords)
app.post('/submit-index', (req, res) => {
  const { documentName, encryptedDocument, keywords } = req.body;

  if (!documentName || !encryptedDocument || !keywords) {
    return res.status(400).json({ message: 'Invalid data from the data owner' });
  }

  // Store the index (encrypted document and hashed keywords)
  const hashedKeywords = keywords.map(hashKeyword);
  dataIndex.push({ documentName, encryptedDocument, keywords: hashedKeywords });

  res.json({ message: 'Index submitted successfully by data owner' });
});

// Route for the Data User to submit a search query
app.post('/search', (req, res) => {
  const { searchTerm } = req.body;

  if (dataIndex.length === 0) {
    return res.status(400).json({ message: 'No index available for searching' });
  }

  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is missing' });
  }

  // Hash the search term
  const hashedSearchTerm = hashKeyword(searchTerm);

  // Search for the document with the most keyword matches
  let bestMatch = null;
  let maxMatches = 0;

  dataIndex.forEach((entry) => {
    const matchCount = entry.keywords.filter(keyword => keyword === hashedSearchTerm).length;

    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestMatch = {
        documentName: entry.documentName,
        encryptedDocument: entry.encryptedDocument,
        matches: maxMatches,
      };
    }
  });

  if (bestMatch) {
    res.json({
      message: `Best match found!`,
      documentName: bestMatch.documentName,
      encryptedDocument: bestMatch.encryptedDocument,
      matchCount: bestMatch.matches,
    });
  } else {
    res.json({ message: `No matches found for "${searchTerm}".` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
