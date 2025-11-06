import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config/supabase.config';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

// Example route to get users
app.get('/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});