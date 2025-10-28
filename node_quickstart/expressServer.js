import express from 'express';
const app = express();
const port = 5000;

app.use(express.static('public_frontend'));
app.use(express.json());

app.post('/admin/dashboard/upload_listing', (req, res) => {
  res.status(200); // if it goes through confirm by setting to 200
  const listing = req.body; // reciveing name, brand, .... many other attrivutes in this array
  console.log(`I think server received:`, listing);
}); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})