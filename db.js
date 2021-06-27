import psql from "pg";
const { Pool } = psql;

const pool = new Pool({
    user:"postgres",
    password:"root",
    database:"homeJam",
    host:"localhost",
    port:5432
})

export default pool;