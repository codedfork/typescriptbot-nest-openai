const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');

const app = express();
const PORT = 8000;

// Start the server
// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'admin',
    password: 'Bfs@1234',
    database: 'example'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

// Function to extract SQL query from markdown text
function extractSQLQueryFromMarkdown(text) {
    // Remove the markdown formatting (```)
    const regex = /```sql\s*([\s\S]+?)\s*```/;
    const match = text.match(regex);

    if (match) {
        return match[1].trim(); // Return the query without the markdown formatting
    }

    return null; // Return null if no match is found
}


// Middleware to parse JSON
app.use(express.json());

// Route to interact with OpenAI via localhost:3000
app.post('/openai', async (req, res) => {
    try {
        const payload = {
            textContent: `genarete an sql command to ${req.body.textContent}, no further explaination. users table has columns ["user_id",
  "username",
  "first_name",
  "last_name",
  "gender",
  "password",
  "status"]
` };
        const response = await axios.post('http://localhost:3000/openai/chat', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Response from OpenAI:', response.data.data[0]);
        const query = extractSQLQueryFromMarkdown(response.data.data[0]);
        // Example query to test the connection
        console.log('Extracted SQL Query:', query);
        db.query(`${query}`, (err, results) => {
            if (err) {
                console.error('Error running query:', err.message);
                return;
            }
            console.log('Query result:', results);
            res.status(200).send({ results });
        });
    } catch (error) {
        console.error('Error connecting to OpenAI:', error.message);
        res.status(500).send({ error: 'Failed to connect to OpenAI' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);


});