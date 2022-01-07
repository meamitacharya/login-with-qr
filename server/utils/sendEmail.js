const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


/****************************************************************
 * -------------------Get Access Token--------------------------
 ***************************************************************/
const redirectURL = "https://developers.google.com/oauthplayground";
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  redirectURL
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const accessToken = oauth2Client.getAccessToken();

/***************************************************************
 * ------------------Configure Trasnporter--------------------==
 ***************************************************************/
let transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
     type: 'OAuth2',
     user: process.env.EMAIL,
     clientId: process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET,
     refreshToken: process.env.REFRESH_TOKEN,
     accessToken,
     expires: 1484314697598,
   },
 });

 const sendEmail = async ({ to, subject, text, html }) => {
   await transporter.sendMail({
     to,
     subject,
     text,
     html,
   });
 };
 
 module.exports = sendEmail;




