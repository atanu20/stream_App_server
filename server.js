require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const auth = require('./middleware/auth');

const axios = require('axios')

const userTable = require('./models/user');

const sendEmailGrid = require('./controllers/mailSendGrid');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
app.use('/api/user', require('./routes/userRouter'));

app.get('/', (req, res) => {
  res.send('welcome to Streaming');
});

app.get('/auth/isVerify', auth, async (req, res) => {
  try {
    const user = req.user;
    // console.log(user.id);

    const mydata = await userTable.findById(user.id).select('-password');
    if (mydata) {
      res.send({ success: true, msg: 'done', userInfo: mydata });
    } else {
      res.send({ success: false, msg: 'something wrong', userInfo: [] });
    }
  } catch (err) {
    res.send({ success: false, msg: 'Something wrong' });
  }
});


// app.get("/apicall/:sitem",async(req,res)=>{
//   try {
//     const search=req.params.sitem;

//     const result=await axios.get(`https://finnhub.io/api/v1/quote?symbol=${search}&token=cj2aqkpr01qi64tg1360cj2aqkpr01qi64tg136g`)

// // console.log(result)
//     res.send({success:true,result:result.data})
//   } catch (error) {
//     console.log(error)
//     res.send({success:false})
//   }
// })



// Connect to mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to mongodb');
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
