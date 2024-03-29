const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')
dotenv.config();
const logger = require('./services/logger');
const nodemailer = require('nodemailer');
const services = require("./services/verifyProvider");

const cloudinary = require('cloudinary').v2;

//models
const authRoutes = require('./routes/authRoutes');




app.use(bodyParser.json());
//security for all routes
app.use(cors());
app.use(morgan('dev'));


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 3030,
//     secure: true,
//     auth: {
//       user: "muralikrishnatangella1466@gmail.com",
//       pass: "wakx zuyh urdn xuxz",
//     }
//   });
//   // Send email
//   transporter.sendMail({
//     from: "muralikrishnatangella1466@gmail.com",
//     to: "mknmkn146@gmail.com",
//     subject: 'Password Reset Request',
//     text:"hi"
//   }).then((res)=>{
//     console.log("email sent")
//   }).catch((err)=>{
//     console.log("error",err)
//   })

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dm9tstije',
  api_key: '666288419778575',
  api_secret: 'ePbKyWnLRMZrKLOblErAImG_0aE'
});

const filePath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
// const uploadImageToCloudinary = (filePath) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(filePath, { folder: 'uploads' }, (error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// };
// uploadImageToCloudinary(filePath)
//   .then((imageUrl) => {
//     console.log('Image uploaded successfully:', imageUrl);
//   })
//   .catch((error) => {
//     console.error('Error uploading image:', error);
//   });

// cloudinary.uploader.destroy("uploads/mecrfb0lrzaebzqqidwa", (error, result) => {
//     if (error) {
//       console.error('Error removing image:', error);
//     } else {
//       console.log('Image removed successfully:', result);
//     }
//   });


app.use("/auth",authRoutes);


logger.warn("hi")
//DB connection 
mongoose.connect(process.env.DATABASE_URI).then(()=>{
    console.log('DB is connected')
}).catch((err)=>{
    console.log('DB connection error:',err)
})

async function callF(){
  const isValid = await services.verifyGoogleToken('eyJhbGciOiJSUzI1NiIsImtpZCI6ImFkZjVlNzEwZWRmZWJlY2JlZmE5YTYxNDk1NjU0ZDAzYzBiOGVkZjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCCJhenAiOiI4ODQ3MjczNzc2MjgtM3NxaGVjdXE0bGozMDI4dThxcXR0bmp0azhyNWc2NTguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4ODQ3MjczNzc2MjgtM3NxaGVjdXE0bGozMDI4dThxcXR0bmp0azhyNWc2NTguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQyNzk4OTQ4Mzc3MjI4MzAxMDkiLCJlbWFpbCI6Im11cmFsaWtyaXNobmF0YW5nZWxsYTE0NjZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJUX04zUU4wWllIYlNDbXMxcnMySTZnIiwibmFtZSI6Ik1VUkFMSUtSSVNITkEgVEFOR0VMTEEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSTRMbVUxTlVmaWxVUDZKZWxyRW43OVF6cFVmZzYxSEkzYjV4YUh2MmFZYjVZcD1zOTYtYyIsImdpdmVuX25hbWUiOiJNVVJBTElLUklTSE5BIiwiZmFtaWx5X25hbWUiOiJUQU5HRUxMQSIsImlhdCI6MTcxMTcwMDgyMywiZXhwIjoxNzExNzA0NDIzfQ.roGRZFEHIj2LK0pqHNr_couu4g30KPsm2bHfbqJfg6WMoWnzprBy2vGIiOU3C2Hc8KJWZ95SZ0drdvOeQW8d35p3IARkW0ZoGnCjD1x3CHKoOcAbhwOdwOwrj5k1Z56yawtX7FsC94ctqaLfEgH38s5sW5hBcMlmb95hMpZkE6HOlxlCwd-6nx_VBht00f2OXKgckWPJusKpoIGYczs3DdVCBK8A36QKvt1K9T3TbV6qWin9e5pRzjhwh7juChmE-DrmmsglxlpGh4U3-tjnYac4pfyhsCwqq9oRawRc01fztaOOojYwGdYK_WjlMCZVyUwKjQbeBLgdOlV0kUWhRw');
  console.log(isValid,"valid")
}
callF();
app.listen(process.env.PORT,()=>{
    console.log(`App is running on ${process.env.PORT}`)  
});

