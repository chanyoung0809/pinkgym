const login_bg = document.querySelector(".login_bg"); 
// 로그인창 감싸는 부모태그
const login_reqs = document.querySelectorAll("a[href='/login']");
// 로그인 요청하는 a태그들
const login_close = document.querySelector(".login_wrap .close_btn"); 
// 로그인 창 닫기 버튼

// 관리자 계정 로그인 도울 버튼
const adminAccountsBtn = document.querySelector("#adminAccounts");
// 아이디, 비밀번호 입력창
const IDinput = document.querySelector("#userID");
const PWinput = document.querySelector("#userPW");

//로그인 요청 받았을 때
Array.from(login_reqs).forEach((login) => {
    login.addEventListener('click',(e)=>{
        e.preventDefault();
        // 로그인 경로로 처리하지 않고 보던 페이지에 고정시킴
        body.classList.add("show");
        // body 태그에 클래스 추가하고
        login_bg.style.display = "flex";
        // 로그인 창 보이게 처리
        IDinput.focus();
        // 아이디 입력란에 포커싱
        
        // 로그인 창이 등장했을 때만 실행되게 함
        // 버튼 누르면 아이디, 비밀번호 자동완성 
        adminAccountsBtn.addEventListener("click",()=>{
            IDinput.value = "admin_1234";
            PWinput.value = "admin_123456";
        });
    });
});

// login_bg가 보일 때
if(login_bg){
    // 로그인 닫기 버튼 눌렀을 때
    login_close.addEventListener('click',(e)=>{
        // 아이디, 비밀번호 입력창 다 지우고 전체화면 원상복귀
        IDinput.value = "";
        PWinput.value = "";
        body.classList.remove("show");
        login_bg.style.display='none';
    });
}