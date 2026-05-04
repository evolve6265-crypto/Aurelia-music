const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Required for external hosted DBs like Railway
    ssl: { rejectUnauthorized: false }
});

const initDB = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS guild_settings (
            guild_id VARCHAR(20) PRIMARY KEY,
            volume INTEGER DEFAULT 100,
            loop_mode VARCHAR(20) DEFAULT 'off',
            prefix VARCHAR(5) DEFAULT '/'
        );
    `;
    try {
        await pool.query(query);
        console.log('🧊 [Database] PostgreSQL Tables Initialized.');
    } catch (err) {
        console.error('❌ [Database Error]', err);
    }
};

const getGuildSettings = async (guildId) => {
    const res = await pool.query('SELECT * FROM guild_settings WHERE guild_id = $1', [guildId]);
    if (res.rows.length === 0) {
        await pool.query('INSERT INTO guild_settings (guild_id) VALUES ($1)', [guildId]);
        return { guild_id: guildId, volume: 100, loop_mode: 'off', prefix: '/' };
    }
    return res.rows[0];
};

const updateVolume = async (guildId, volume) => {
    await pool.query(
        'INSERT INTO guild_settings (guild_id, volume) VALUES ($1, $2) ON CONFLICT (guild_id) DO UPDATE SET volume = $2',
        [guildId, volume]
    );
};

// This is the clean, fixed export line!
module.exports = { pool, initDB, getGuildSettings, updateVolum
    e };
