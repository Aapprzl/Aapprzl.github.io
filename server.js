const express = require('express');
const fileUpload = require('express-fileupload');
const mammoth = require('mammoth');

const app = express();
app.use(fileUpload());
app.use(express.static('public')); // Folder untuk frontend

app.post('/upload', async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    try {
        const result = await mammoth.extractRawText({ buffer: file.data });
        const text = result.value;

        // Proses konten file
        const lines = text.split('\n');
        const title = lines[0] || "Untitled";
        const summary = lines[1] || "No summary";
        const content = lines.slice(2).join('\n') || "No content";

        res.json({
            title: title.trim(),
            summary: summary.trim(),
            content: content.trim(),
        });
    } catch (error) {
        res.status(500).send('Error processing file: ' + error.message);
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
