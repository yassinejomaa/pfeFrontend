const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques depuis le dossier de build
app.use(express.static(path.join(__dirname, 'dist/pfefrontend/browser')));

// Rediriger toutes les requêtes vers index.html pour le routage Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/pfefrontend/browser/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
console.log(`App running on port ${port}`);
});
