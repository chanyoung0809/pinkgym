const depth1 = document.querySelectorAll("#header_bot .center .Gnb .depth1");
const depth2 = document.querySelectorAll("#header_bot .center .Gnb .depth1 .depth2");
const bg = document.querySelector("#header_bot .Gnb_Bg");

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
