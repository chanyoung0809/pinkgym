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
// 파일 저장을 위한 multer 설정 구간
const storage = multer.diskStorage({
    // storage 상수
    destination: function (req, file, cb) {
        // 어디에 저장할 것인가?
      cb(null, 'public/upload') //업로드 폴더 지정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'))
      // 영어가 아닌 다른 파일명 안깨지고 나오게 처리(궰쇊어 안나오게 해줌)
    }
  })
  
const upload = multer({ storage: storage })
//upload는 위의 설정사항을 담은 변수(상수) 

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

//메인페이지
app.get("/", (req, res)=>{
    db.collection("product").find().toArray((err, products)=>{
        db.collection("location").find().toArray((err, locates)=>{
            db.collection("posts").find().sort({post_num:-1}).toArray((err, posts)=>{
                //최신 글 3개까지만 보여주기 위해 처리
                let free = [];
                let sell = [];
                posts.forEach((post)=>{
                    (post.category == 'free') ? free.push(post) : sell.push(post);
                })
                free = free.slice(0,3);
                sell = sell.slice(0,3);
                res.render("index", {login:req.user, products:products, locates:locates, free:free, sell:sell});
            });
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
app.get("/join", (req, res) => {
    if (req.user) {
      // 이미 로그인된 사용자는 이전에 보고 있던 경로(혹시 없으면 메인)로 리다이렉트
      const previousPath = req.headers.referer || "/";
      res.send(`<script> let confirmLogout = confirm("로그아웃 후 회원가입을 진행하시겠습니까?");
        if (confirmLogout) {
          window.location.href = "/logout";
        } else {
          window.location.href = '${previousPath}';
        }</script>`);
    } 
    else {
        db.collection("product").find().toArray((err, products) => {
            db.collection("location").find().toArray((err, locates) => {
                res.render("join", { login: req.user, products: products, locates: locates });
            });
        });
    }
});
  
// 회원가입 DB처리(비동기 - 아이디 중복체크)
app.post("/DBtest",(req,res)=>{
    db.collection("members").findOne({userID:req.body.userID},(err,member)=>{
         // 중복 아이디 있는 경우
        res.send({result:member});
    })
})
// 회원가입 DB처리(동기)
app.post("/DBjoin", (req, res)=>{  
    db.collection("members").findOne({userID:req.body.userID},(err,member)=>{
        db.collection("count").findOne({name:"회원수"},(err,result)=>{
            db.collection("members").insertOne({
                No:result.memberCount, // 회원번호
                userID:req.body.userID, // 회원아이디
                userPW:req.body.userPW, // 비밀번호
                userName:req.body.userName, // 이름
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
    })
});

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

app.post("/logincheck", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send("서버 오류");
        }
        if (!user) {
            return res.status(401).send("<script>alert('아이디 또는 패스워드가 맞지 않습니다.'); window.location.href=document.referrer;</script>");
        }
        req.logIn(user, (err) => {
            if (err) {
            console.error(err);
            return res.status(500).send("서버 오류");
            }
            return res.redirect("/");
        });
    })(req, res, next);
});
// 로그아웃처리 요청 경로
app.get("/logout",(req,res)=>{
    // 로그아웃 함수 적용 후 메인페이지로 이동
    // 로그아웃 함수는 서버의 세션을 제거해주는 역할
    req.logout(()=>{
        res.redirect("/");
    })  
});

// 게시판 2개(자유게시판, 벼룩시장. 카테고리에 맞게 정렬될 것임)
app.get("/board/:category",(req, res)=>{
    const category = req.params.category; // 카테고리 역할 담당할 파라미터값
    /* 게시물 작성 날짜-오늘 날짜 확인 위한 변수 생성 */
    let date = new Date();
    let year = date.getFullYear(); //월
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // 연
    let day = ("0" + date.getDate()).slice(-2); // 일
    let Today = `${year}-${month}-${day}`; // 오늘 날짜
    if(req.user){
        db.collection("product").find().toArray((err, products)=>{
            db.collection("location").find().toArray((err, locates)=>{
                // 카테고리에 맞는 게시글만 찾아와서 페이지네이션 설정하고
                db.collection("posts").find({ category: category }).toArray((err,total)=>{
                    let totalData = total.length;
                    // 게시글 전체 갯수값 알아내서 변수로 저장
    
                    // 페이지 번호가 공란일 때(잘못된 값일 때) ? 1로고정 : 받은 페이지값을 숫자로
                    let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
    
                    // 한 페이지에 보여줄 게시글 갯수 설정
                    let perPage = 6;
                    // 블록당 보여줄 페이징 번호 갯수값 설정
                    let blockCount = 3;
                    // 이전, 다음 블록 간 이동 하기 위한 현재 페이지 블록 구하기
                    let blockNum = Math.ceil(pageNumber / blockCount);
    
                    // 블록 안 페이지 번호 시작값 알아내기 (1) 2 3 4 5
                    let blockStart = ((blockNum -1) * blockCount) + 1;
                    // 블록 안 페이지 번호 끝값 알아내기 1 2 3 4 (5)
                    let blockEnd =  blockStart + blockCount -1;
    
                    // 게시글 전체 갯수를 토대로 전체 페이지 번호가 총 몇 개 만들어져서 표시돼야하는지?
                    let totalPaging = Math.ceil(totalData/perPage);
    
                    // 블록(그룹)에서 마지막 페이지 번호가 끝 번호보다 크다면 페이지의 끝번호를 강제로 고정시킴(잘못된 접근 막기 위해)
                    if(blockEnd > totalPaging){
                        blockEnd = totalPaging;
                        // 끝번호 7인데, 10번 페이지를 보려고 한다면 7로 고정시킴
                    }
    
                    // 페이징블록(그룹)의 총 갯수값 구하기
                    let totalBlock = Math.ceil(totalPaging / blockCount);
    
                    // db에서 게시글 뽑아서 가져오기 위한 순서값(몇 번째부터 가져올 것인가?) 정해주기(페이지번호 1 - 20, 19, 18. 2 - 17, 16, 15...)
                    let startFrom = (pageNumber - 1) * perPage;
    
                    // 카테고리에 맞는 게시글들만 찾아와서 result 안에 저장
                    db.collection("posts").find({ category: category }).sort({post_num:-1}).skip(startFrom).limit(perPage).toArray((err,result)=>{
                        res.render("boardlists.ejs", {
                            category:category,
                            data:result, // find로 찾아온 게시글 데이터들
                            totalPaging:totalPaging, // 페이지 번호 총 갯수값 -> 7개
                            blockStart:blockStart, // 블록 안의 페이지 시작 번호값
                            blockEnd:blockEnd, // 블록 안의 페이지 끝 번호값
                            blockNum:blockNum, // 보고있는 페이지 번호가 몇 번 블록(그룹번호)에 있는지 확인
                            totalBlock:totalBlock, // 블록(그룹)의 총 갯수 -> 2개
                            pageNumber:pageNumber, // 현재 보고있는 페이지 값
                            products:products, // 프로그램
                            locates:locates, // 지점안내
                            login:req.user, //로그인 정보
                            Today:Today, // 오늘 날짜
                            text:"",
                        })
                    })
                })
            })
        })   
    }
    else{
        res.send(`
        <script>
            alert("잘못된 접근입니다. 로그인 후 이용해주세요.");
            if (document.referrer == "" || document.referrer.includes('board') || document.referrer.includes('mypage')) {
                window.location.href = "/";
            } 
            else {
                window.location.href = document.referrer;
            }             
        </script>
        `);
    }

});

// 게시글 + 댓글 검색 기능
app.get("/search/:category", (req,res)=>{
    const category = req.params.category;
    /* 게시물 작성 날짜-오늘 날짜 확인 위한 변수 생성 */
    let date = new Date();
    let year = date.getFullYear(); //월
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // 연
    let day = ("0" + date.getDate()).slice(-2); // 일
    let Today = `${year}-${month}-${day}`; // 오늘 날짜
    // 검색조건 세팅
    let check = [
    {
        // $search:{ 뭘 어떻게 찾을 건지?
        $search:{
            
            index: "Post_comment_search", //db사이트에서 설정한 index 이름
            text:{
                query: req.query.inputText,
                // 검색단어 입력단어값 (query:명령을 내리다, 질의하다)
                path: req.query.search
                // 어떤 항목을 검색할 것인지?
                // 여러 개 설정할 때는 배열로 설정
            }   
        }
    },
    {
        // 어떻게 정렬할 것인가? 1-> 오름차순, -1 -> 내림차순
        $sort:{num:-1}
    },
    ]
    //위에서 설정한 변수 check를 aggregate 매개변수로 가져옴
    db.collection("posts").aggregate(check).toArray((err,result)=>{
        // result에서 배열 형태로 가져옴
        // 배열 형태로 가져온 total 정렬 작업
        let totalData = result.length;
        // 게시글 전체 갯수값 알아내서 변수로 저장

        // 페이지 번호가 공란일 때(잘못된 값일 때) ? 1로고정 : 받은 페이지값을 숫자로
        let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);

        // 한 페이지에 보여줄 게시글 갯수 설정
        let perPage = 6;
        // 블록당 보여줄 페이징 번호 갯수값 설정
        let blockCount = 3;
        // 이전, 다음 블록 간 이동 하기 위한 현재 페이지 블록 구하기
        let blockNum = Math.ceil(pageNumber / blockCount);

        // 블록 안 페이지 번호 시작값 알아내기 (1) 2 3 4 5
        let blockStart = ((blockNum -1) * blockCount) + 1;
        // 블록 안 페이지 번호 끝값 알아내기 1 2 3 4 (5)
        let blockEnd =  blockStart + blockCount -1;

        // 게시글 전체 갯수를 토대로 전체 페이지 번호가 총 몇 개 만들어져서 표시돼야하는지?
        let totalPaging = Math.ceil(totalData/perPage);

        // 블록(그룹)에서 마지막 페이지 번호가 끝 번호보다 크다면 페이지의 끝번호를 강제로 고정시킴(잘못된 접근 막기 위해)
        if(blockEnd > totalPaging){
            blockEnd = totalPaging;
            // 끝번호 7인데, 10번 페이지를 보려고 한다면 7로 고정시킴
        }

        // 페이징블록(그룹)의 총 갯수값 구하기
        let totalBlock = Math.ceil(totalPaging / blockCount);

        // db에서 게시글 뽑아서 가져오기 위한 순서값(몇 번째부터 가져올 것인가?) 정해주기(페이지번호 1 - 20, 19, 18. 2 - 17, 16, 15...)
        let startFrom = (pageNumber - 1) * perPage;

        db.collection("product").find().toArray((err, products)=>{
            db.collection("location").find().toArray((err, locates)=>{
                res.render("boardlists.ejs",{
                    data:result, 
                    category: category, // 게시판 카테고리
                    text:req.query.inputText, // 검색값
                    totalPaging:totalPaging, // 페이지 번호 총 갯수값 -> 7개
                    blockStart:blockStart, // 블록 안의 페이지 시작 번호값
                    blockEnd:blockEnd, // 블록 안의 페이지 끝 번호값
                    blockNum:blockNum, // 보고있는 페이지 번호가 몇 번 블록(그룹번호)에 있는지 확인
                    totalBlock:totalBlock, // 블록(그룹)의 총 갯수 -> 2개
                    pageNumber:pageNumber, // 현재 보고있는 페이지 값
                    products:products, // 프로그램
                    locates:locates, // 지점안내
                    login:req.user, //로그인 정보
                    Today:Today, // 오늘 날짜
                });
                // 게시판 페이지를 데이터 담아서 랜더링함
                // (redirect 쓰면, 해당 경로로 가는 걸로 요청되고, 그러면 전체 데이터가 담긴 게시판 페이지로 랜더링되기 때문에 안됨!)
            })
        })
    })

})

// 글 작성하기 페이지
app.get("/board/:category/write", (req, res)=>{
    const category = req.params.category; // 카테고리 역할 담당할 파라미터값
    if(req.user) {
        db.collection("product").find().toArray((err, products)=>{
            db.collection("location").find().toArray((err, locates)=>{
                res.render("boardwrite", {category:category, products:products, locates:locates, login:req.user});
            })
        })
    }
    else {
        res.send(`
        <script>
            alert("잘못된 접근입니다. 로그인 후 이용해주세요.");
            if (document.referrer == "" || document.referrer.includes('board') || document.referrer.includes('mypage')) {
                window.location.href = "/";
            } 
            else {
                window.location.href = document.referrer;
            }             
        </script>
        `);
    }
});

// 글 작성되는 DB처리
app.post("/DBpost/:category", upload.array("post_file"), (req, res)=>{
    const category = req.params.category; // 카테고리 역할 담당할 파라미터값
    let fileNames = [];
    if(req.files){ // 첨부파일이 있다면
        for(let i = 0; i < req.files.length; i++){
            fileNames[i] = req.files[i].filename;
            // 첨부한 파일들의 파일명만 뽑아서 배열에 옮겨담음
        }
    }
    else {
        // 첨부파일이 없어도 게시글은 등록되어야 함
        fileNames = [];
    }
    db.collection("count").findOne({'name':"게시글수"},(err,countResult)=>{
        db.collection("posts").insertOne({
            category:category,
            post_num:countResult.boardCount,
            post_title:req.body.post_title,
            post_author:req.user.userName,
            post_date:req.body.post_date,
            post_text:req.body.post_text,
            attachfile:fileNames,
            commentCount:0,
            comments:[],
            // 옮겨담은 배열명으로 첨부파일 수정
        },(err,result)=>{
            db.collection("count").updateOne({'name':"게시글수"},{$inc:{boardCount:1}},(err,result)=>{
                res.redirect(`/board/${category}/detail/${countResult.boardCount}`);
            })
        })
    });
});

// 게시글 세부 페이지
app.get("/board/:category/detail/:num", (req, res)=>{
    const category = req.params.category; // 카테고리 역할 담당할 파라미터값
    const num = req.params.num; // 게시물 순번값 담당하는 파라미터값
    /* 게시물/댓글 작성 날짜-오늘 날짜 확인 위한 변수 생성 */
    let date = new Date();
    let year = date.getFullYear(); //월
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // 연
    let day = ("0" + date.getDate()).slice(-2); // 일
    let Today = `${year}-${month}-${day}`; // 오늘 날짜
    if(req.user) {
        db.collection("product").find().toArray((err, products)=>{
            db.collection("location").find().toArray((err, locates)=>{
                db.collection("posts").findOne({post_num:Number(num)},(err,result)=>{
                    //find로 찾아온 데이터값은 result에 담긴다
                    //상세페이지 보여주기위해서 찾은 데이터값을 함께 전달한다.
                    res.render("boarddetail", {category:category, login:req.user, data:result, locates:locates, products:products, Today:Today});
                })
            })
        })
    }
    else {
        res.send(`
        <script>
            alert("잘못된 접근입니다. 로그인 후 이용해주세요.");
            if (document.referrer == "" || document.referrer.includes('board') || document.referrer.includes('mypage')) {
                window.location.href = "/";
            } 
            else {
                window.location.href = document.referrer;
            }             
        </script>
        `);
    }
});

// 게시글 수정 페이지
app.get("/board/update/:num",(req,res)=>{
    db.collection("product").find().toArray((err, products)=>{
        db.collection("location").find().toArray((err, locates)=>{
            db.collection("posts").findOne({post_num:Number(req.params.num)},(err,result)=>{
                res.render("boardupdate.ejs",{login:req.user, data:result, locates:locates, products:products});
            })
        })
    })
});

//DB 내 게시글 수정 요청
app.post("/DBupdate" , upload.array("post_file"), (req,res)=>{
    // 첨부파일을 변경한 경우 -> 배열 안에 데이터가 있는 경우
    let changeFiles = [];
    let changeDatas = {};
    if(req.files.length > 0){
        // 첨부판 파일들의 파일명만 뽑아서 배열에 담고 배열에 저장
        for(let i=0; i<req.files.length; i++){
            changeFiles[i] = req.files[i].filename;
        }
        // db 수정처리할 데이터 정리(객체로)
        changeDatas = {
            post_title:req.body.post_title,
            post_text:req.body.post_text,
            attachfile:changeFiles
        }
    }
    else{// 첨부파일 변경하지 않은 경우 -> 빈 배열
        changeDatas = {
            post_title:req.body.post_title,
            post_text:req.body.post_text
            //첨부파일 수정 막음
        } 
    }
    db.collection("posts").updateOne({post_num:Number(req.body.post_num)},{$set:changeDatas},(err,result)=>{
        res.redirect(`/board/${req.body.category}/detail/${req.body.post_num}`); 
    })
})

// 게시글 상세 페이지 -> 삭제 요청
app.get("/dbdelete/:category/:num",(req,res)=>{
    const category = req.params.category;
    db.collection("posts").deleteOne({post_num:Number(req.params.num)},(err,result)=>{
        //게시글 삭제후 게시글 목록페이지로 요청
        res.redirect(`/board/${category}`);
    })
})

// 게시글 전체 페이지 -> 선택삭제 요청
// 체크박스 선택한 게시글들 지우는 처리
app.get("/dbseldel/:category",(req,res)=>{
    const category = req.params.category;
    // delOk안에있는 문자열 데이터들을 정수데이터로 변경
    let changeNumber = [];
    req.query.delOk.forEach((item,index)=>{
        changeNumber[index] = Number(item); 
        //반복문으로 해당 체크박스 value 값 갯수만큼 숫자로 변환후 배열에 대입
    })
    //변환된 게시글 번호 갯수들만큼 실제 데이터베이스에서 삭제처리 deleteMany()
                                            //배열명에 있는 데이터랑 매칭되는 것들을 삭제
    db.collection("posts").deleteMany({post_num:{$in:changeNumber}},(err,result)=>{
        res.redirect(`/board/${category}`); //게시글 목록페이지로 요청
    })
});

// 댓글 작성 DB 요청
app.post("/commentUpdate/:num", (req, res) => {
    const num = req.params.num; // 게시물 순번값 담당하는 파라미터값
    const comment = { // 새로 만들어줄 댓글
        comment_num: Number(req.body.comment_num),
        comment_author: req.user.userName,
        comment_content: req.body.comment_content,
        comment_date: req.body.comment_date
    };   
    db.collection("posts").findOneAndUpdate(
        { post_num: Number(num) }, // 게시물 순번값으로 도큐먼트 찾기
        { $push: { comments: comment } }, // comments 객체배열에 새로운 댓글 추가
        { returnOriginal: false }, // 업데이트 후 업데이트된 도큐먼트 반환
        (err, result) => {
            if (err) {
                console.error("업데이트 실패:", err);
                res.status(500).send("업데이트를 수행하는 동안 오류가 발생했습니다.");
            } else if (!result.value) {
                console.error("해당 게시글을 찾을 수 없습니다.");
                res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });
            } else {
                res.redirect(`/board/${result.value.category}/detail/${result.value.post_num}`);
            }
        }
    );
});

// 댓글 수정
app.post("/commentChange/:boardnum/:commentnum", (req, res) => {
    const boardnum = req.params.boardnum; // 게시글 번호
    const commentnum = req.params.commentnum; // 댓글 번호

    const commentChangeKey = `commentContentChange${Number(commentnum)}`;
    const commentChangeValue = req.body[commentChangeKey];

    db.collection("posts").findOneAndUpdate(
        { post_num: Number(boardnum), "comments.comment_num": Number(commentnum) },
        { $set: { "comments.$.comment_content": commentChangeValue } },
        { returnOriginal: false },
        (err, result) => {
            if (err) {
                console.error("댓글 수정 중 오류 발생:", err);
                res.status(500).json({ message: "댓글 수정 중 오류가 발생했습니다." });
            } else if (!result.value) {
                console.error("해당 게시글을 찾을 수 없습니다.");
                res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });
            } else {
                res.redirect(`/board/${result.value.category}/detail/${result.value.post_num}`);
            }
        }
    );
});

// 댓글 삭제
app.get("/commentDel/:boardnum/:commentnum", (req, res) => {
    const boardnum = req.params.boardnum; // 게시글 번호
    const commentnum = req.params.commentnum; // 댓글 번호

    db.collection("posts").findOneAndUpdate(
        { post_num: Number(boardnum) },
        { $pull: { comments: { comment_num: Number(commentnum) } } },
        { returnOriginal: false },
        (err, result) => {
            if (err) {
                console.error("댓글 삭제 중 오류 발생:", err);
                res.status(500).json({ message: "댓글 삭제 중 오류가 발생했습니다." });
            } else if (!result.value) {
                console.error("해당 게시물을 찾을 수 없습니다.");
                res.status(404).json({ message: "해당 게시물을 찾을 수 없습니다." });
            } else {
                const category = result.value.category; // 게시물의 카테고리
                res.redirect(`/board/${category}/detail/${boardnum}`);
            }
        }
    );
});

// 메인페이지 - 무료체험 신청 경로
app.post("/trial", (req, res)=>{
    // input 태그 여러 개에 나눠진 핸드폰 번호 정리
    let trialPhone2 = req.body.trial_phone2;
    let trialPhone3 = req.body.trial_phone3;
    const trialPhone = `010-${trialPhone2}-${trialPhone3}`;
    db.collection("count").findOne({'name':"무료체험신청자수"},(err,countResult)=>{
        db.collection("trial").insertOne({
            trial_num : countResult.trialCount, // 무료체험순번
            trial_date : req.body.trial_date, // 신청일자
            trial_name : req.body.trial_name, // 신청인성함
            trial_phone : trialPhone, // 신청인 연락처
            trial_locate : req.body.trial_locate, // 신청 지점
            trial_product : req.body.trial_product, // 관심 프로그램
            trial_context : req.body.trial_context, // 문의내용
        },(err,trialData)=>{
            db.collection("count").updateOne({'name':"무료체험신청자수"},{$inc:{trialCount:1}},(err,result)=>{
                res.send(`<script> alert('무료체험 신청이 완료되었습니다.'); window.location.href="/" </script>`);
            })
        })
    })
});

// 마이페이지
/* 개인정보 열람, 수정 가능 관리자만 무료체험 신청인 열람 가능,  */
app.get("/mypage", (req,res)=>{
    if(req.user){
        db.collection("product").find().toArray((err, products)=>{
            db.collection("location").find().toArray((err, locates)=>{
                db.collection("trial").find().sort({trial_num:-1}).toArray((err, trials)=>{
                    res.render("mypage", {login:req.user, locates:locates, products:products, trials:trials});
                })    
            })  
        })  
    }
    else{
        res.send(` 
        <script>
            alert("잘못된 접근입니다. 로그인 후 이용해주세요.");
            if (document.referrer == "" || document.referrer.includes('board') || document.referrer.includes('mypage')) {
                window.location.href = "/";
            } 
            else {
                window.location.href = document.referrer;
            }             
        </script>`);
    }
});

//DB 내 회원정보 수정 요청
app.post("/memberEdit/:userID" , (req,res)=>{
    const userID = req.params.userID;
    //비밀번호 바꿀 때
    if(userPW !== "" && userPW2 !== ""){
        // db 수정처리할 데이터 정리(객체로)
        changeDatas = {
            userPW:req.body.userPW, //변경할 비밀번호
            memberphone:`${req.body.userPhone1}-${req.body.userPhone2}-${req.body.userPhone3}`, // 핸드폰 번호
        }
    }
    //비밀번호 안바꿀때(핸드폰번호만 바꿀 때)
    else {
        changeDatas = {
            memberphone:`${req.body.userPhone1}-${req.body.userPhone2}-${req.body.userPhone3}`, // 핸드폰 번호
        }
    }
    db.collection("members").updateOne({userID:userID},{$set:changeDatas},(err,result)=>{
        res.send(`<script>alert("회원정보가 수정됐습니다. 개인정보 보안을 위해 다시 로그인해주세요."); window.location.href="/logout";</script>`); 
    })
})