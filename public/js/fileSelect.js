const dateinput= document.querySelector("#post_date"); //글 작성일 삽입 위한 변수

let submitDate = ()=>{ // 글 작성 날짜 삽입 위한 함수
    let date = new Date(); // Date 생성
    let year = date.getFullYear(); // 작성연도
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // 작성월(1~9 : 01~09 / 10~12 : 010~012, slice로 뒤부터 2글자 잘라냄)
    let day = ("0" + date.getDate()).slice(-2); // 작성일(1~9 : 01~09 / 10~31 : 010~031, slice로 뒤부터 2글자 잘라냄)
    let hour = ("0" + date.getHours()).slice(-2); // 작성시
    let minute = ("0" + date.getMinutes()).slice(-2); //작성분
    let writeDate = `${year}-${month}-${day} ${hour}:${minute}`; 
    // 최종 삽입할 작성연월일시분 (yyyy-mm-dd ho:mn형식)
    dateinput.value = writeDate; //작성일자 인풋 태그 값으로 작성일자 값 저장.
}
const upload = document.querySelector("#upload"); //데이터 전송역할
const inputFile = document.querySelector("#post_file"); // 첨부파일 input태그
const submitBtn = document.querySelector("#submit"); // 전송버튼
const extCheck = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]; // 체크할 확장자명

submitBtn.addEventListener("click", (e)=>{
    
    // 파일 있을 때
    if(inputFile.files && inputFile.files.length > 0){
        // input type="file"에는 value 가 아닌 files(단수, 복수 관계없이)
        // console.log(inputFile.files);
        // FileList 라는 배열 형식으로 출력됨. 배열 안에는 파일의 정보가 객체 형식으로 저장되어있음. 단수일때는 0번째.
        let fileName = inputFile.files[0].name; 
        //첨부한 파일명

        let fileLength = fileName.length; 
        // 파일명 길이값(나중에 확장자명 식별할 때 사용)

        let fileDots = fileName.lastIndexOf(".");
        // .기호가 시작하는 순번

        let fileExt = fileName.substring(fileDots, fileLength);
        // 추출한 확장자

        let fileCheck = extCheck.includes(fileExt);
        // 체크할 확장자명 안에 추출한 확장자가 있는지 찾아줌

        // console.log(`파일명은 ${fileName}, 길이는 ${fileLength}, .기호가 시작하는 순번 ${fileDots}, 최종적으로 추출되는 확장자 ${fileExt}, 확장자 있나요? ${fileCheck}`);

        if(fileCheck){ 
            submitDate();
            upload.submit(); 
        } 
        else{
            e.preventDefault();
            alert("이미지 파일만 첨부 가능합니다");  
        }
    }
    // 파일 없을 때
    else {
        submitDate();
        upload.submit(); 
    }
})
