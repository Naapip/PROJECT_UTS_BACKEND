const express = require('express');
const router = express.Router();
const { getDB } = require('../../../core/db');
const User = require('../../../models/users-schema');

module.exports = (app) => { 

    router.get('/users', async (req, res) => {
        try {
            const db = getDB();
            const { q } = req.query;
            let query = {};
            if (q) {
                query = { username: { $regex: q, $options: 'i' } };
            }
            const users = await db.collection('users').find(query).toArray();
            res.json({ 
                message: q ? `Hasil pencarian untuk: ${q}` : "Menampilkan semua user",
                count: users.length,
                data: users.map(u => ({ id: u._id, username: u.username, email: u.email }))
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/threads', async (req, res) => {
        try {
            const db = getDB();
            const { q } = req.query;
            let query = {};
            if (q) {
                query = {
                    $or: [
                        { title: { $regex: q, $options: 'i' } },
                        { content: { $regex: q, $options: 'i' } }
                    ]
                };
            }
            const threads = await db.collection('threads').find(query).toArray();
            res.json({
                message: q ? `Hasil pencarian thread untuk: ${q}` : "Menampilkan semua thread",
                count: threads.length,
                data: threads
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    
    app.use('/search', router); 
};