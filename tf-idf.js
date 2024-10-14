var tfidf = require('tf-idf');

// Specify the directory containing your documents and the search term.
var directoryPath = '/Users/sprak/Documents/sem7/search-scheme/search-directory';  // Update with your actual directory
var searchTerm = 'write';      // Update with your search term

console.log("Hello");
// Call getRank function
tfidf.getRank(directoryPath, searchTerm, function (err, docRank) {
    console.log("Hello frrom tf-idf");
    if (err) {
        console.error("Error: ", err);
    } else {
        console.log("Ranked Documents: ");
        console.log(docRank);  // docRank will contain an array of objects with the document name and its tf-idf score.
    }
});
