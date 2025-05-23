import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "user"

//PERBARUI MODEL USER DENGAN MENAMBAHKAN PASSWORD DAN REFRESH TOKEN
const Notes = db.define(
  "notes", // Nama Tabel
  {
    name : Sequelize.STRING,
    email: Sequelize.STRING,
    title: Sequelize.STRING,
    category: Sequelize.STRING,
  },{
    freezeTableName : true,
}
);

db.sync().then(() => console.log("Database synced"));

export default Notes;