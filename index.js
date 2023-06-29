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
    db = result.db("AI_portfolio");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log(`서버연결 성공, http://localhost:${port} 로 접속하세요.`);
    });

});

// // 로그인시 검증 처리
// passport.use(new LocalStrategy({
//     usernameField:"userID",
//     passwordField:"userPW",
//     session:true,
//     },      //해당 name값은 아래 매개변수에 저장
//     function(userMail, userPW, done) {
//                     //회원정보 콜렉션에 저장된 아이디랑 입력한 아이디랑 같은지 체크                                 
//       db.collection("Users").findOne({ userID:userID }, function (err, user) {
//         if (err) { return done(err); } //아이디 체크 시 코드(작업 X)
//         if (!user) { return done(null, false); }  //아이디 체크 시 코드(작업 X)
//         //비밀번호 체크 여기서 user는 db에 저장된 아이디의 비번값
//         if (userPW == user.userPW) { // 비밀번호 체크 시 코드
//             // 저장된 비밀번호가, 유저가 입력한 비밀번호와 같으면 if
//             return done(null, user);
//           } else {
//             // 다르면 else
//             return done(null, false);
//           }
//       });
//     }
// ));

app.get("/", (req, res)=>{
    //메인페이지
   res.render("index", {login:req.user});
})
