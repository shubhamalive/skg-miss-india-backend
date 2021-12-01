const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const port = process.env.PORT || 80

app.use(cors());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "/")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const db = mysql.createConnection({
  user: "process.env.DB_USER",
  host: "process.env.DB_HOST",
  port: "3306",
  password: "process.env.DB_PASSWORD",
  database: "process.env.DB_NAME",
  insecureAuth: true,
});

// Test Ping
app.get( '/ping', (req,res) => {

  res.send('Server is up and Running!')
  
  });
// Test Ping

app.post("/users", upload.any("photo"), (req, res) => {
  const {
    fname,
    lname,
    mobile,
    email,
    age,
    address,
    city,
    state,
    country,
    heightinc,
    heightft,
    weight,
    hips,
    marital,
    gender,
    ig,
    fb,
    birthstate,
    passport,
    oci,
    bust,
    waist,
    DOB,
    whatsapp,
    preferredcity,
  } = req.body;

  const fullphoto = req.files[0].filename;
  const closeup = req.files[1].filename;
  const midshot = req.files[2].filename;

  db.query(
    "INSERT INTO users (fname, lname, mobile, email, age, address, city, state, country,heightinc,heightft,weight, hips, marital, gender, ig, fb, birthstate, passport, oci, bust, waist, DOB, whatsapp, preferredcity, fullphoto, closeup, midshot ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      fname,
      lname,
      mobile,
      email,
      age,
      address,
      city,
      state,
      country,
      heightinc,
      heightft,
      weight,
      hips,
      marital,
      gender,
      ig,
      fb,
      birthstate,
      passport,
      oci,
      bust,
      waist,
      DOB,
      whatsapp,
      preferredcity,
      fullphoto,
      closeup,
      midshot,
    ],
    (err, res) => {
      if (err) {
        console.log(err);
      }
      if (res) {
        console.log("Values inserted in DB");
        const transport = nodemailer.createTransport({
          pool: true,
          host: "process.env.SMTP_HOST",
          port: 465,
          secure: true, // use TLS
          auth: {
            user: "process.env.SMTP_USERNAME",
            pass: "process.env.SMTP_PASSWORD",
          },
        });
        for (let index = 0; index < 2; index++) {
          if (index === 0) {
            const mailOptions = {
              from: "no-reply@skgmissindia.com",
              to: "skgmissindia@gmail.com",
              subject: `New Contestant registration on Website`,
              html: `<html>
              <head>
              <style>
              table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
              }
              tr {
                width: fit-content;
              }
              
              td, th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
              }
              
              tr:nth-child(even) {
                background-color: #dddddd;
              }
              </style>
              </head>
              <body>
              
              <h2>Contestant details:</h2>
              
              <table>
                <tr>
                  <th>Name</th>
                  <td>${fname} ${lname}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>${mobile}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>${email}</td>
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>${gender}</td>
                </tr>
                <tr>
                  <th>Age</th>
                  <td>${age}</td>
                </tr>
                <tr>
                  <th>DOB</th>
                  <td>${DOB}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>${address}</td>
                </tr>
                <tr>
                  <th>City</th>
                  <td>${city}</td>
                </tr>
                <tr>
                  <th>State</th>
                  <td>${state}</td>
                </tr>
                <tr>
                  <th>Country</th>
                  <td>${country}</td>
                </tr>
                <tr>
                  <th>Marital status</th>
                  <td>${marital}</td>
                </tr>
                <tr>
                  <th>WhatsApp number</th>
                  <td>${whatsapp}</td>
                </tr>
                <tr>
                  <th>Instagram ID</th>
                  <td>${ig}</td>
                </tr>
                <tr>
                  <th>Facebook ID</th>
                  <td>${fb}</td>
                </tr>
                <tr>
                  <th>Birth state</th>
                  <td>${birthstate}</td>
                </tr>
                <tr>
                  <th>Passport</th>
                  <td>${passport}</td>
                </tr>
                <tr>
                  <th>Preferred city</th>
                  <td>${preferredcity}</td>
                </tr>
                <tr>
                  <th>Height</th>
                  <td>${heightft}' ${heightinc}"</td>
                </tr>
                <tr>
                  <th>Weight</th>
                  <td>${weight}</td>
                </tr>
                <tr>
                  <th>Breast/Bust</th>
                  <td>${bust}</td>
                </tr>
                <tr>
                  <th>Waist</th>
                  <td>${waist}</td>
                </tr>
                <tr>
                  <th>Hip</th>
                  <td>${hips}</td>
                </tr>
                <tr>
                  <th>OCI</th>
                  <td>${oci}</td>
                </tr>
                
              </table>
              </body>
              </html>`,
              attachments: [
                {
                  filename: closeup,
                  path: `${__dirname}/uploads/${closeup}`,
                  cid: closeup,
                },
                {
                  filename: midshot,
                  path: `${__dirname}/uploads/${midshot}`,
                  cid: midshot,
                },
                {
                  filename: fullphoto,
                  path: `${__dirname}/uploads/${fullphoto}`,
                  cid: fullphoto,
                },
              ],
            };
            transport.sendMail(mailOptions, (err) => {
              if (err) console.log(err);
              console.log("Email sent to the admin");
            });
          } else {
            const mailOptions = {
              from: "no-reply@skgmissindia.com",
              to: { email },
              subject: `New Email from SKG`,
              html: `<h1>Thank you for registering with us! We will contact you soon if needed.</h1>`,
            };
            transport.sendMail(mailOptions, (err) => {
              if (err) console.log(err);
              console.log("Email sent to the contestant");
            });
          }
        }
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server Up and Running`)
});
