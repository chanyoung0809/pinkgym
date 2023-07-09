const express = require("express");
const multer = require('multer'); 
const app = express(); 
const port = 3200;

// 데이터베이스 명령어 함수들 사용하기 위해 불러들이는 작업
const MongoClient = require('mongodb').MongoClient;

// ejs 파일 형식을 node.js에서 사용하기 위한 시작구문
app.set("view engine", "ejs")
//사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({ extended: true })); 
app.use(express.json())
// 이미지, .css, .js등 정적 파일들을 ejs 파일 내에서 사용하기 위한 구문
app.use(express.static('public'));
/*
    passport  passport-local  express-session 설치후 불러오기
    로그인 검정 및 세션 생성에 필요한 기능 사용
*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret :'secret', resave : false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session()); 

let db; // 데이터베이스 연결을 위한 변수세팅

// MongoClient.connect("본인의 데이터베이스 연결 주소",function(){})
MongoClient.connect("mongodb+srv://cisalive:cisaliveS2@cluster0.cjlsn98.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }
    //err <- DB에서 제공해주는 에러 메세지. 빨간색으로 틀린 부분 알려줌

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    // db = result.db("만들어준DB이름");
    db = result.db("Pinkgym");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log(`서버연결 성공, http://localhost:${port} 로 접속하세요.`);
    });

});

// 로그인시 검증 처리
passport.use(new LocalStrategy({
    usernameField:"userID",
    passwordField:"userPW",
    session:true,
    },      //해당 name값은 아래 매개변수에 저장
    function(userID, userPW, done) {
                    //회원정보 콜렉션에 저장된 아이디랑 입력한 아이디랑 같은지 체크                                 
      db.collection("members").findOne({ userID:userID }, function (err, user) {
        if (err) { return done(err); } //아이디 체크 시 코드(작업 X)
        if (!user) { return done(null, false); }  //아이디 체크 시 코드(작업 X)
        //비밀번호 체크 여기서 user는 db에 저장된 아이디의 비번값
        if (userPW == user.userPW) { // 비밀번호 체크 시 코드
            // 저장된 비밀번호가, 유저가 입력한 비밀번호와 같으면 if
            return done(null, user);
          } else {
            // 다르면 else
            return done(null, false);
          }
      });
    }
));

// 파비콘 오류 처리
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

//메인페이지
app.get("/", (req, res)=>{
    db.collection("product").find().toArray((err, products)=>{
        db.collection("location").find().toArray((err, locates)=>{
            res.render("index", {login:req.user, products:products, locates:locates});
        });
    });
})
// 헬스장 소개
app.get("/intro", (req, res)=>{
    db.collection("product").find().toArray((err, products)=>{
        db.collection("location").find().toArray((err, locates)=>{
            res.render("intro", {login:req.user, products:products, locates:locates});
        });
    });
})
// 지점안내
app.get("/location", (req, res)=>{
    db.collection("product").find().toArray((err, products)=>{
        db.collection("location").find().toArray((err, locates)=>{
            res.render("location", {login:req.user, products:products, locates:locates});
        });
    });
})
// 프로그램 소개
app.get("/program", (req, res)=>{
    db.collection("product").find().toArray((err, products)=>{
        db.collection("location").find().toArray((err, locates)=>{
            res.render("program", {login:req.user, products:products, locates:locates});
        });
    });
})
// 회원가입
app.get("/join", (req, res)=>{
    db.collection("product").find().toArray((err, products)=>{
        db.collection("location").find().toArray((err, locates)=>{
            res.render("join", {login:req.user, products:products, locates:locates});
        });
    });
})
// 회원가입 DB처리
app.post("/DBjoin", (req, res)=>{
    db.collection("members").findOne({userID:req.body.userID},(err,member)=>{
        if(member){ 
            // 중복 아이디 있는 경우
            res.send(`
            <script> 
            alert("이미 가입된 아이디가 존재합니다."); 
            window.location.href="/login";
            </script>`);
        }
        else{
            db.collection("count").findOne({name:"회원수"},(err,result)=>{
                db.collection("members").insertOne({
                    No:result.memberCount, // 회원번호
                    userID:req.body.userID, // 회원아이디
                    userPW:req.body.userPW, // 비밀번호
                    userBirth : req.body.userBirth, //생년월일
                    userGender : "female", //성별
                    memberphone:`${req.body.userPhone1}-${req.body.userPhone2}-${req.body.userPhone3}`, // 핸드폰 번호
                    role:"common" // 역할 - 일반회원
                },(err)=>{
                    db.collection("count").updateOne({name:"회원수"},{$inc:{memberCount:1}},(err)=>{
                        res.send(`
                        <script> 
                        alert("회원가입이 완료되었습니다."); 
                        window.location.href="/";
                        </script>`);
                    });
                })
            })
        }
    })
});

//로그인 경로 요청 시, 로그인 창만 보이게 하고 싶음...
// app.get("/login", (req, res)=>{
//     res.send(`
//     <script>window.location.href = history.back();document.querySelector("body").classList.add("show");document.querySelector(".login_bg").style.display = "flex";</script>`);
// });

//처음 로그인 했을 시 세션 생성 memberid는 데이터에 베이스에 로그인된 아이디
//세션 만들어줌
passport.serializeUser(function (user, done) {
    done(null, user.userID)
});
  
//다른 페이지(서브페이지,게시판 페이지 등 로그인 상태를 계속 표기하기 위한 작업)
//로그인이 되있는 상태인지 체크
passport.deserializeUser(function (userID, done) {
// memberid<- 찾고자 하는 id : memberid<- 로그인했을 때 id
db.collection('members').findOne({userID:userID }, function (err,result) {
    done(null, result);
    })
}); 

// 로그인 처리 요청 경로 (failureRedirect: 로그인 실패했을 때 경로 )
app.post("/logincheck", passport.authenticate('local', {failureRedirect : "/" }), (req,res)=>{
    res.redirect("/") // 성공하면 메인페이지로 이동시킴
})
// 로그아웃처리 요청 경로
app.get("/logout",(req,res)=>{
    // 로그아웃 함수 적용 후 메인페이지로 이동
    // 로그아웃 함수는 서버의 세션을 제거해주는 역할
    req.logout(()=>{
        res.redirect("/");
    })
    
});

// 게시판
app.get("/board/:category",()=>{
    
});