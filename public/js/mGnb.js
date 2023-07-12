// 모바일메뉴 오픈 함수
const body = document.querySelector("body"); 
// 스크롤 기능 막아줄 바디태그
const mGnb_wrap = document.querySelector(".m_gnb_bg"); 
// 모바일메뉴 감싸는 부모태그
const closeBtn = document.querySelector("#m_gnb .user_wrap .hbg_menu > a");
// 모바일메뉴의 닫기 버튼
const openBtn = document.querySelector("#header_top .center .hbg_menu > a");
// 헤더의 모바일메뉴 열기 버튼
openBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    body.classList.add("show");
    closeBtn.classList.add("on");
    openBtn.classList.add("on");
    mGnb_wrap.classList.add("show");
});
closeBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    mGnb_wrap.classList.remove("show");
    closeBtn.classList.remove("on");
    openBtn.classList.remove("on");
    body.classList.remove("show");
});


// 1, 2 depth 메뉴 3개씩
const mdepth1 = document.querySelectorAll("#m_gnb .Gnb > li.depth1 > a > span > span.material-symbols-outlined");
const mdepth2 = document.querySelectorAll("#m_gnb .Gnb > li.depth1 > ul.depth2");

// 모바일메뉴 내 메뉴 선택 함수
mdepth1.forEach((span, i) => {
    span.addEventListener("click", (e) => {
        e.preventDefault(); // a태그 기능 해제
        if (span.classList.contains("on")) {
            // 이미 2depth가 펼쳐져 있다면
            span.classList.remove("on");
            mdepth2[i].classList.remove("on");
            // 1, 2depth접음
        } 
        else {
            // 펼쳐져 있지 않은 경우는 모든 2depth 에서 클라스 제거하고
            mdepth1.forEach((el, idx)=>{
                el.classList.remove("on");
                mdepth2[idx].classList.remove("on");
            })
            // 누른 메뉴의 1, 2depth 펼침
            span.classList.add("on");
            mdepth2[i].classList.add("on");
        }
    });
});