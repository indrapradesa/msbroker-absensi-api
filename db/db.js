import mysql from 'mysql2'
import config from '../config/index.js';

export const pool_hr = mysql.createPool({
    host    : config.conn.host,
    user    : config.conn.user,
    password: config.conn.password,
    database: config.conn.db_dasarata_hr,
}).promise()