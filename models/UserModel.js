import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "user"

//PERBARUI MODEL USER DENGAN MENAMBAHKAN PASSWORD DAN REFRESH TOKEN
const User = db.define(
  "user", // Nama Tabel
  {
    name : Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    title: Sequelize.STRING,
    category: Sequelize.STRING,
    refresh_token: Sequelize.TEXT
  },{
    freezeTableName : true,
    timestamps: false,
}
);

db.sync().then(() => console.log("Database synced"));

export default User;