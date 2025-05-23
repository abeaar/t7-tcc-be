import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function getUser(req, res) {
  try {
    const response = await Users.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

async function createUser(req, res) {
  try {
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 5);

    await Users.create({
      email: email,
      password: encryptedPassword,
    });
    
    res.status(200).json({ msg: "User created!" });
  } catch(error) {
    res.status(400).json({  msg: `Error creating user: ${error}` });
  }
}

//Nambah fungsi buat login handler
async function loginHandler(req, res){
  try{
      const{email, password} = req.body;
      const user = await Users.findOne({
          where : {
              email: email
          }
      });

      if(user){
        //Data User itu nanti bakalan dipake buat ngesign token kan
        // data user dari sequelize itu harus diubah dulu ke bentuk object
        //Safeuserdata dipake biar lebih dinamis, jadi dia masukin semua data user kecuali data-data sensitifnya  karena bisa didecode kayak password caranya gini :
        const userPlain = user.toJSON(); // Konversi ke object
        const { password: _, refresh_token: __, ...safeUserData } = userPlain;

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(isPasswordCorrect) {
          const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn : '5m' 
          });
          const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn : '5m' 
          });
          await Users.update({ refresh_token: refreshToken }, {
            where:{
              id:user.id
            }
          });
          res.cookie('refreshToken', refreshToken,{
            httpOnly : true, //ngatur cross-site scripting, untuk penggunaan asli aktifkan karena bisa nyegah serangan fetch data dari website "document.cookies"
            sameSite : 'none',  //ini ngatur domain yg request misal kalo strict cuman bisa akseske link dari dan menuju domain yg sama, lax itu bisa dari domain lain tapi cuman bisa get
            maxAge  : 24*60*60*1000,
            secure: true, //ini ngirim cookies cuman bisa dari https, kenapa? nyegah skema MITM di jaringan publik, tapi pas development di false in aja
          });
          res.status(200).json({
            status: "Success",
            message: "Login Berhasil",
            safeUserData,
            accessToken 
          });
        }
        else{
          res.status(400).json({
            status: "Failed",
            message: "Password atau email salah",  
          });
        }
      } else{
        res.status(400).json({
        status: "Failed",
        message: "Password atau email salah",
      });
    }
  } catch(error){
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message
    })
  }
}


async function logout(req, res) {
   try {
    const refreshToken = req.cookies.refreshToken; // Sesuaikan nama cookie
    if (!refreshToken) return res.sendStatus(204); // No Content, berarti user sudah logout

    // User Validation
    const data = await Users.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!data) return res.status(204).json("User Tidak Ditemukan");

    // Mengupdate refresh token menjadi null
    await Users.update({ refresh_token: null }, { where: { id: data.id } });

    // Menghapus refresh cookie
    res.clearCookie("refreshToken",{
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    }); // Sesuaikan nama cookie

    // Response
    return res.status(200).json({
      message: "Logout Berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
}


export { createUser, loginHandler, logout, getUser };