const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const app = express();
const path = require('path');
const session = require('express-session')
const ejsMate = require('ejs-mate')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash')
const methodOverride = require('method-override')
const MongoDBStore = require("connect-mongo");
const mongoSanitize = require('express-mongo-sanitize');
const catchAsync = require('./utils/CatchAsync')
const nodemailer = require('nodemailer')
const ExpressError = require('./utils/ExpressError')
const Registration = require('./model/registration')
const Admin = require('./model/admin')
const helmet = require('helmet')
// routes
const studentRoute = require('./routes/registration')
const subscribeRoute = require('./routes/subscribe')
const adminRoute = require('./routes/admin')
const scheduleRoute = require('./routes/schedule')
const updatesRoute = require('./routes/updates')
const sidebarRoute = require('./routes/sidebar')
const feeRoute = require('./routes/fee')
const gradeRoute = require('./routes/grade')



const cors = require('cors');
const { assert } = require('console');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/iedsinternationalschool'


mongoose.connect(dbUrl, {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, " connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})
const secret = process.env.SESSION_SECRET

const sessionConfig = {
    secret: secret,
    name: '_rolandOrtiz',
    resave: false,
    saveUninitialized: true,
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(cors({
    origin: ['https://cdn.jsdelivr.net', 'https://kit.fontawesome.com'],
    credentials: true, // Include cookies in the request (if applicable)
}));

app.set('view engine', 'ejs');  // This line sets EJS as the template engine
app.set('views', path.join(__dirname, 'views'));
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')))



const frameSrcUrls=[
    "https://js.stripe.com/",
    "https://www.sandbox.paypal.com/",
    "https://www.facebook.com",
    ]
    const scriptSrcUrls = [
        "https://stackpath.bootstrapcdn.com/",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css",
        "https://cdn.ckeditor.com/",
        "https://cdnjs.cloudflare.com/",
        "https://ionic.io/ionicons/",
        "https://kit.fontawesome.com/",
        "https://cdnjs.cloudflare.com/",
        "https://cdn.jsdelivr.net",
        "https://www.google-analytics.com",
        "https://code.jquery.com/",
        "https://fontawesome.com",
        "https://js.stripe.com/v3/",
        "https://www.paypal.com/sdk/js",
        "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
        "https://api2.amplitude.com/",
        "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js",
        "https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.3/socket.io.js",
        "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://unpkg.com/i18next/dist/umd/i18next.min.js",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js",
  
    ];
    const styleSrcUrls = [
        "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css",
        "https://getbootstrap.com/",
        "https://use.fontawesome.com/",
        "https://cdnjs.cloudflare.com/",
        "https://ionic.io/ionicons/",
        "https://kit-free.fontawesome.com/",
        "https://stackpath.bootstrapcdn.com/",
        "https://fonts.googleapis.com/",
        "https://use.fontawesome.com/",
        "https://fontawesome.com",
        "https://api2.amplitude.com/",
        "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    ];
    const connectSrcUrls = [
        "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
        "https://unsplash.com/",
     "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css",
        "https://ionic.io/ionicons/",
        "https://unpkg.com/",
        "https://fontawesome.com",
        "https://ka-f.fontawesome.com/",
        "https://www.sandbox.paypal.com/xoplatform/logger/api/logger",
     "https://api2.amplitude.com/",
    ];
    const fontSrcUrls = [
        "https://ionic.io/ionicons/",
     "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css",
        "https://fonts.gstatic.com/",
        "https://cdnjs.cloudflare.com/",
        "https://use.fontawesome.com/",
        "https://fontawesome.com",
        "https://ka-f.fontawesome.com/",
     "https://api2.amplitude.com/",
     "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/fonts/bootstrap-icons.woff",
     "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/fonts/bootstrap-icons.woff2",
    
    ];
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: [],
                formAction: ["'self'"],
                frameSrc:["'self'","'unsafe-inline'",...frameSrcUrls],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'",...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                mediaSrc: ["'self'"],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
                    "https://images.unsplash.com/",
                    "https://i.pinimg.com/564x/6c/bf/00/6cbf00a772725add422adf6bb976f6ba.jpg",
                    "https://media.istockphoto.com/",
                    "https://img.icons8.com/ios-glyphs/256/phone-disconnected.png",
                    "https://source.unsplash.com/collection/10623559",
                    "https://source.unsplash.com/collection/8657917",

                    "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp",
                    "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/images/ui-icons_444444_256x240.png",
    
    
    
    
    
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
            },
        })
    );
    app.use((req, res, next) => {
      res.setHeader('Set-Cookie', 'HttpOnly; Secure; SameSite=None');
      next();
    });
    


app.use(express.json())
app.use(methodOverride('_method'));
app.use(session(sessionConfig))
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
app.use(flash());

app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();

})



app.get('/', async (req, res) => {
    try {
        const stats = await Registration.aggregate([
            { $group: { _id: '$curriculum', count: { $sum: 1 } } }
        ]);

        const curriculumStats = {
            'Khmer Education Program': 0,
            'International English Program': 0,
            'Chinese Language Classes': 0,
            'General English Program': 0
        };

        stats.forEach(stat => {
            if (curriculumStats.hasOwnProperty(stat._id)) {
                curriculumStats[stat._id] = stat.count;
            }
        });

        res.render('home/home', { curriculumStats });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
app.get('/faculty', (req, res) => {
    res.render('faculties/faculty')
})
app.get('/curriculums', (req, res) => {
    res.render('curriculums/curriculums')
})



app.post('/send', catchAsync(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    // create a mail options object that defines the email content
    const mailOptions = {
        from: `${email}`,
        to: process.env.GMAIL_EMAIL,
        subject: `New contact form submission: ${subject}`,
        html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
    };

    // send the email using the transporter object
    await transporter.sendMail(mailOptions);

    req.flash('success', 'Thank you for your message! We will get back to you soon.');
    res.redirect('/');
}));




app.use('/', studentRoute);
app.use('/', subscribeRoute);
app.use('/', adminRoute);
app.use('/', scheduleRoute);
app.use('/', updatesRoute);
app.use('/', sidebarRoute);
app.use('/', feeRoute);
app.use('/', gradeRoute);



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!';
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});