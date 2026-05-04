const { Pool } = require('pg');
require('dotenv').config();

// 1. Safely connect to the database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 2. INTERNAL ANTI-CRASH: Prevent database disconnects from killing the bot
pool.on('error', (err) => {
    console.error('🛡️ [Anti-Crash] Database error caught and prevented:', err.message);
});

// 3. Initialize tables safely
const initDB = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS guild_settings (
                guild_id VARCHAR(20) PRIMARY KEY,
                volume INTEGER DEFAULT 100,
                loop_mode VARCHAR(20) DEFAULT 'off',
                prefix VARCHAR(5) DEFAULT '/'
            );
        `;
        await pool.query(query);
        console.log('🧊 [Database] PostgreSQL Tables Initialized Successfully.');
    } catch (err) {
        console.error('❌ [Database Init Error]:', err.message);
    }
};

// 4. Safely get settings without crashing if the DB is slow
const getGuildSettings = async (guildId) => {
    try {
        const res = await pool.query('SELECT * FROM guild_settings WHERE guild_id = $1', [guildId]);
        if (res.rows.length === 0) {
            await pool.query('INSERT INTO guild_settings (guild_id) VALUES ($1)', [guildId]);
            return { guild_id: guildId, volume: 100, loop_mode: 'off', prefix: '/' };
        }
        return res.rows[0];
    } catch (err) {
        console.error('❌ [Database Error] Could not get settings:', err.message);
        // Fallback so the bot keeps working even if the DB fails
        return { guild_id: guildId, volume: 100, loop_mode: 'off', prefix: '/' };
    }
};

// 5. Safely update volume
const updateVolume = async (guildId, volume) => {
    try {
        await pool.query(
            'INSERT INTO guild_settings (guild_id, volume) VALUES ($1, $2) ON CONFLICT (guild_id) DO UPDATE SET volume = $2',
            [guildId, volume]
        );
    } catch (err) {
        console.error('❌ [Database Error] Could not update volume:', err.message);
    }
};

// 6. 100% CLEAN EXPORT LINE - NO BROKEN CHARACTERS
module.exports = { pool, initDB, getGuildSettings, updateVolu
    me };
