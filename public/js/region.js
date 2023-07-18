// 매장 사진 슬라이드 반복문으로 생성
for(let i = 0; i <= 5; i++){
    let swiper = new Swiper(`#regionSwiper${i}`, {
        direction: 'horizontal',
        loop: true, //무한반복 T/F
        grabCursor:true,
        autoplay: {
            delay: 3000,
        },
        navigation: {
            nextEl: `.swiper-button-next-${i}`,
            prevEl: `.swiper-button-prev-${i}`,
        },
    });
}    

// 위도, 경도 집합
const Latitudes = [35.8217784, 35.8886111, 35.858999, 35.8701932, 35.9423608, 35.8489532];
const Longitudes = [128.5280347, 128.5916667, 128.6233898, 128.5969103, 128.6164736, 128.5337426];

// 매장 위치 카카오맵 반복문으로 생성
for (let i = 0; i < 6; i++) {
    var container = document.getElementById(`map${i+1}`);  
    var options = {
        center: new kakao.maps.LatLng(Latitudes[i], Longitudes[i]),
        level: 3
    };

    var map = new kakao.maps.Map(container, options);

    var mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    var markerPosition = new kakao.maps.LatLng(Latitudes[i], Longitudes[i]);
    var marker = new kakao.maps.Marker({
        position: markerPosition
    });
    marker.setMap(map);
}
