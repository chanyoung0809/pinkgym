// 검색어 입력하지 않았을 때 경고창 띄우기 -> 입력했으면 넘어감
const searchForm = document.querySelector("#searchForm");
// 검색창쪽 폼태그
const inputText = document.querySelector("#inputText");
// 검색어 input 태그
const searchBtn = document.querySelector("#searchBtn");
// 검색 버튼

searchBtn.addEventListener("click", (event)=>{

    let data = inputText.value; // 검색어 입력값 변수에 저장
    // 지역변수이기 때문에 서버 쪽 변수랑 이름 겹쳐도 됨 
    let result = data.trim();
   
    // trim() <- 입력값 앞 뒤 빈 공백문자 제거 
    if(result === ""){
        // 입력값 없으면 넘어가지 못하게 하고
        event.preventDefault();
        alert("검색어를 입력하세요");
    }
    // 입력값 있어야 넘어가게 함
    else{
        searchForm.submit();
    }

});