for(let i = 0; i <= 5; i++){
    let swiper = new Swiper(`#regionSwiper${i}`, {
        direction: 'horizontal',
        loop: true, //무한반복 T/F
        grabCursor:true,
        navigation: {
            nextEl: `.swiper-button-next-${i}`,
            prevEl: `.swiper-button-prev-${i}`,
        },
    });
}    
    