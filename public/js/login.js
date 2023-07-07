const login_bg = document.querySelector(".login_bg"); 
// 로그인창 감싸는 부모태그
const login_reqs = document.querySelectorAll("a[href='/login']");
// 로그인 요청하는 a태그들
const login_close = document.querySelector(".login_wrap .close_btn"); 
// 로그인 창 닫기 버튼


//로그인 요청 받았을 때
Array.from(login_reqs).forEach((login) => {
    login.addEventListener('click',(e)=>{
        // 링크이동 막고, 로그인 창 띄우기
        e.preventDefault();
        body.classList.add("show");
        login_bg.style.display='flex';
    });
});
// 로그인 닫기 버튼 눌렀을 때
login_close.addEventListener('click',()=>{
    //전체화면 원상복귀
    body.classList.remove("show");
    login_bg.style.display='none';
});
