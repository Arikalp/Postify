const express= require('express');
const mongoose= require('mongoose');
const app= express();
const cookieParser= require('cookie-parser');
const bycrypt= require('bcrypt');
const jwt=require('jsonwebtoken');

const UserModel= require('./models/user');
const Postmodel= require('./models/post');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('login', { title: 'Home' });
}
);

app.post('/register', (req, res) => {
    const { username,email, password } = req.body;

    if(UserModel.findOne({ email })) {
        console.log('User already exists');

    }
    
    bycrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).send('Error hashing password');
        }

        const newUser = await new UserModel({
            username,
            email,
            password: hash
        });

            console.log(newUser);
            await newUser.save();
    });

    let token= jwt.sign({ email, password },"Arikalp");
     res.cookie('token', token);
     res.send('User registered successfully!');


    
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body; // This will now work with POST requests

    const user = await UserModel.findOne({username }); // Use findOne instead of find
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send('Invalid username or password');
    }

    console.log("Login successful!");
    let token = jwt.sign({ username }, 'your-secret-key');
    res.cookie('token', token, { httpOnly: true });
    res.send('User logged in successfully!');
});

app.get('/logout', (req, res) => {  
    res.clearCookie('token');
    console.log('User logged out successfully!');
    res.redirect('/');
}
);



function isloggedIn(req, res, next) {   
    if(res.cookies.token ===""){
        return res.status(401).send('Unauthorized: No token provided');
    } 
    else
    {
        let data=jwt.verify(res.cookies.token,'Arikalp');
        req.user=data;
    
    }
    next();
}
        

app.listen(3000, () => {    
    console.log('Server is running on port 3000');
}
);
