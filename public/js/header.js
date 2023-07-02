const depth1 = document.querySelectorAll("#header_bot .center .Gnb > li");
const depth2 = document.querySelectorAll("#header_bot .center .Gnb .depth1 .depth2");
const bg = document.querySelector("#header_bot .Gnb_Bg");

//1뎁스 메뉴에 호버했을 때 하위메뉴 펼쳐짐, 접힘
depth1.forEach((li) => {
    li.addEventListener("mouseenter", () => {
        depth2.forEach((dps2) => {
            dps2.classList.add("on");
        });
        bg.classList.add("on");
    });
});

depth1.forEach((li) => {
    li.addEventListener("mouseleave", () => {
        bg.classList.remove("on");
        depth2.forEach((dps2) => {
            dps2.classList.remove("on");
        });
    });
});
// 2뎁스 배경화면에 호버했을 때도 메뉴 사라지지 않고 보임
bg.addEventListener("mouseenter", () => {
    depth2.forEach((dps2) => {
        dps2.classList.add("on");
    });
    bg.classList.add("on");
});
// 2뎁스 배경화면에서 마우스 호버 해제하면 메뉴 사라짐
bg.addEventListener("mouseleave", () => {
    depth2.forEach((dps2) => {
        dps2.classList.remove("on");
    });
    bg.classList.remove("on");
});