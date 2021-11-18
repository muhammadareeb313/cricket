import express from 'express'
import mongoose from "mongoose"
import cors from "cors"
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";


const __dirname = path.resolve();
import {
    stringToHash,
    varifyHash
} from "bcrypt-inzi"
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


const SECRET = process.env.SECRET || "12345"
const PORT = process.env.PORT || 5001
const app = express()

mongoose.connect('mongodb+srv://areebkhan:2626@cluster1.g9mhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    created: { type: Date, default: Date.now },
});
const Post = mongoose.model("Ball", {
    over: Number,
    created: { type: Date, default: Date.now },

    bowlerBalls: Number,
    batsmanBalls: Number,
  
})

const Score = mongoose.model("Score", {
    score: Number,
    created: { type: Date, default: Date.now },
    wicket: Number,
    bowlerwicket: Number,        
  
})


const Player = mongoose.model("Player", {
    batsmanAName:String,
    batsmanBName:String,
    bowlerNameA:String,
    bowlerNameB:String,
    batsmanABall: Number,   
   batsmanARuns:Number,
    batsmanBBall:Number,
    batsmanBRuns: Number,       
  
})



app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5001"],
    credentials: true
}))

app.use('/', express.static(path.join(__dirname, 'web/build')))
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./web/build/index.html"))
})


app.post('/api/v1/login', (req, res, next) => {

    if (!req.body.email ||
        !req.body.password
    ) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    }
    console.log("req.body: ", req.body);

    User.findOne({ email: req.body.email }, (err, user) => {

        if (err) {
            res.status(500).send("error in getting database")
        } else {
            if (user) {

                varifyHash(req.body.password, user.password).then(result => {
                    if (result) {

                        var token = jwt.sign({
                            name: user.name,
                            email: user.email,
                            _id: user._id,
                        }, SECRET);
                        console.log("token created: ", token);

                        res.cookie("token", token, {
                            httpOnly: true,
                            // expires: (new Date().getTime + 300000), //5 minutes
                            maxAge: 900000
                        });

                        res.send({
                            name: user.name,
                            email: user.email,
                            _id: user._id,
                        });
                    } else {
                        res.status(401).send("Authentication fail");
                    }
                }).catch(e => {
                    console.log("error: ", e)
                })

            } else {
                res.send("user not found");
            }
        }
    })
})

app.post('/api/v1/signup', (req, res, next) => {

    if (!req.body.email ||
        !req.body.password ||
        !req.body.name
    ) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    } else {

        User.findOne({ email: req.body.email }, (err, user) => {
            if (user) {
                res.send("user already exist");
            } else {
                console.log(req.body)

                stringToHash(req.body.password).then(passwordHash => {
                    console.log("hash: ", passwordHash);

                    let newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: passwordHash,
                    })
                    newUser.save(() => {
                        console.log("data saved")
                        res.send('signup success')
                    })
                })
            }
        })
    }

})

app.use((req, res, next) => {

    jwt.verify(req.cookies.token, SECRET,
        function (err, decoded) {

            req.body._decoded = decoded;

            console.log("decoded: ", decoded) // bar

            if (!err) {
                next();
            } else {
                res.status(401).sendFile(path.join(__dirname, "./web/build/index.html"))
            }

        })

});

app.post('/api/v1/logout', (req, res, next) => {
    res.cookie("token", "", {
        httpOnly: true,
        maxAge: 300000
    });
    res.send();
})

app.get('/api/v1/profile', (req, res) => {
    User.findOne({ email: req.body._decoded.email }, (err, user) => {

        if (err) {
            res.status(500).send("error in getting database")
        } else {
            if (user) {
                res.send({
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                });
            } else {
                res.send("user not found");
            }
        }
    })
})

// app.post('/api/v1/profile', (req, res) => {
//     res.send('profile created')
// })
// app.put('/api/v1/profile', (req, res) => {
//     res.send('profile updated')
// })
// app.delete('/api/v1/profile', (req, res) => {
//     res.send('profile deleted')
// })

app.post("/api/v1/ball", (req, res) => {
    const newPost = new Post({
        over: req.body.over,
         bowlerBalls: req.body. bowlerBalls,
      batsmanBalls: req.body.batsmanBalls,
    });
    newPost.save().then(() => {
        console.log("Post created");

        io.emit("POSTS", {
            over: req.body.over,
            bowlerBalls: req.body. bowlerBalls,
            batsmanBalls: req.body.batsmanBalls,
        });

        res.send("Post created");
    });
});



app.post("/api/v1/score", (req, res) => {
    const newScore = new Score({
        score: req.body.score,
            wicket: req.body. wicket,
            bowlerwicket: req.body.bowlerwicket,
    });
    newScore.save().then(() => {
        console.log("Post created");

        io.emit("SCORE", {
            score: req.body.score,
            wicket: req.body.wicket,
            bowlerwicket: req.body.bowlerwicket,
        });

        res.send("Post created");
    });
});




app.post("/api/v1/player", (req, res) => {
    const newPlayer = new Player({
        batsmanAName:req.body.batsmanAName,
        batsmanBName:req.body.batsmanBName,
        bowlerNameA:req.body.bowlerNameA,
        bowlerNameB:req.body.bowlerNameB,
        batsmanABall: req.body.batsmanABall,
        batsmanARuns: req.body.batsmanARuns,
        batsmanBBall: req.body.batsmanBBall,
        batsmanBRuns: req.body.batsmanBRuns,
    });
    newPlayer.save().then(() => {
        console.log("Post created");

        io.emit("PLAYER", {
            batsmanAName:req.body.batsmanAName,
            batsmanBName:req.body.batsmanBName,
            bowlerNameA:req.body.bowlerNameA,
            bowlerNameB:req.body.bowlerNameB,
            batsmanABall: req.body.batsmanABall,
            batsmanARuns: req.body.batsmanARuns,
            batsmanBBall: req.body.batsmanBBall,
            batsmanBRuns: req.body.batsmanBRuns,
        });

        res.send("Post created");
    });
});
// app.delete("/api/v1/post", (req, res) => {
//     Post.deleteOne({ _id: req.body.id, userId: req.body._decoded._id }, (err, data) => {
//         res.send("Post deleted");
//     });
// // });

// app.put("/api/v1/post", (req, res) => {
//     Post.updateOne({
//         _id: req.body.id,
//         userId: req.body._decoded._id
//     }, {
//         postText: req.body.postText
//     }, (err, data) => {
//         res.send("Post deleted");
//     });
// });

app.get("/api/v1/ball", (req, res) => {

    const page = Number(req.query.page);

    console.log("page: ", page);

    Post.find({})
        .sort({ created: "desc" })
        .skip(page)
        .limit(1)
        .exec(function (err, data) {
            res.send(data);
            console.log(data);
        });
});

app.get("/api/v1/score", (req, res) => {

    const page = Number(req.query.page);

    console.log("page: ", page);

    Score.find({})
        .sort({ created: "desc" })
        .skip(page)
        .limit(1)
        .exec(function (err, data) {
            res.send(data);
            console.log(data);
        });
});

app.get("/api/v1/player", (req, res) => {

    const page = Number(req.query.page);

    console.log("page: ", page);

    Player.find({})
        .sort({ created: "desc" })
        .skip(page)
        .limit(1)
        .exec(function (err, data) {
            res.send(data);
            console.log(data);
            
        });
});

app.get("/**", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./web/build/index.html"))
    // res.redirect("/")
})

// app.listen(PORT, () => {
//     console.log(`Example app listening at http://localhost:${PORT}`)
// })

const server = createServer(app);

const io = new Server(server, { cors: { origin: "*", methods: "*", } });

io.on("connection", (socket) => {
    console.log("New client connected with id: ", socket.id);

    // to emit data to a certain client
    socket.emit("topic 1", "some data")

    // collecting connected users in a array
    // connectedUsers.push(socket)

    socket.on("disconnect", (message) => {
        console.log("Client disconnected with id: ", message);
    });
});


// setInterval(() => {

//     // to emit data to all connected client
//     // first param is topic name and second is json data
//     io.emit("Test topic", { event: "ADDED_ITEM", data: "some data" });
//     console.log("emiting data to all client");

// }, 2000)


server.listen(PORT, function () {
    console.log(`server is running on http://localhost:${PORT}`);
})