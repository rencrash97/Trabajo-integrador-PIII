import pool from "../config/database.js";

export const TurnoRepository = {
  async findAll() {
    const query = "SELECT * FROM Turno";
    const [rows] = await pool.execute(query);
    return rows;
  },
};
