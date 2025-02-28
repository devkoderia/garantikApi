const sql = require('mssql');
const connection = require('../database/connection');

const poolPromise = new sql.ConnectionPool(connection)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.log('Database Connection Failed! Bad Config: ', err);
        throw err;
    });

const executeQuery = async (strsql) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(strsql);
        return result.recordset;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = { executeQuery };
