const update = document.querySelector("#update"); //데이터 전송역할 form태그
const inputFile = document.querySelector("#post_file"); // 첨부파일 input태그
const submitBtn = document.querySelector("#submit"); // 전송버튼
const extCheck = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]; // 체크할 확장자명

// 첨부파일이 n개 -> 첨부한 파일 중 하나라도 체크할 확장자명이 아니라면 업로드 막아야 함
let validRequest = false; // 유효성검사용 변수
// true일 때 데이터 전송 처리할 역할
let validCount = 0; //체크 시 이미지 파일인 경우에만 카운트가 1씩 증가

submitBtn.addEventListener("click", (e)=>{
    // 파일을 첨부했을 때만 유효성 검사 실행
    if(inputFile.files && inputFile.files.length > 0){
        // 첨부파일 갯수만큼 반복문 처리
        for(let i=0; i< inputFile.files.length; i++){

            let fileName = inputFile.files[i].name; // i번째 파일명 가져오기
            
            let fileLength = fileName.length; // 파일명 길이값(나중에 확장자명 식별할 때 사용)

            let fileDots = fileName.lastIndexOf("."); // .기호가 시작하는 순번

            let fileExts = fileName.substring(fileDots, fileLength); // 추출한 확장자
            
            let fileChange = fileExts.toLowerCase(); // 확장자 소문자로 변경

            let result = extCheck.includes(fileChange); //해당 확장명이 위 배열안에 있는지?

            if(result){
                validCount++;
                if(validCount === inputFile.files.length){
                    validRequest = true;
                }
            }
        }
        if(validRequest){
            // validRequest 값이 true 라면
            update.submit(); //업로드 기능 수행
        }
        else{
            // validRequest 값이 false 라면
            validCount = 0; //카운트 숫자 초기화
            alert("이미지 파일만 업로드 가능합니다."); // 경고창
            e.preventDefault(); // 업로드 기능막고
        }
    }
})