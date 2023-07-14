// 데이터 전송역할 
const upload = document.querySelector("#contact"); 
// 전송버튼
const submitBtn = document.querySelector("#submit"); 
// 무료체험 인적사항 작성란
const trial_name = document.querySelector("#trial_name");
const trial_phone2 = document.querySelector("#trial_phone2");
const trial_phone3 = document.querySelector("#trial_phone3");
const trial_context = document.querySelector("#trial_context");
const personal_terms = document.querySelector("#personal_terms");

const dateinput= document.querySelector("#trial_date"); //글 작성일 삽입 위한 변수

let submitDate3 = ()=>{ // 글 작성 날짜 삽입 위한 함수
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


const rgxName = /^[가-힣]{2,6}$/;
const rgxPhone =  /^[0-9]{4}$/;
const errorMsg = {
    trial_name:"성함을",
    trial_phone:"핸드폰번호를",
    trial_context:"문의사항을",
    personal_terms:"이용약관 체크박스를",
};

if(upload){
    submitBtn.addEventListener("click", (e)=>{
        // 유효성 검사 필요한 목록들
        let validTest = {
            trial_name:false, 
            trial_phone:false, 
            trial_context:false, 
            personal_terms:false
        };
        //이름 검증
        if(!rgxName.test(trial_name.value)){
            alert(`${errorMsg.trial_name} 잘못 입력하셨습니다.`)
            trial_name.focus();
            return;
        }
        else {
            validTest.trial_name = true;
        }
        // 핸드폰번호 검증
        if(!rgxPhone.test(trial_phone2.value)){
            alert(`${errorMsg.trial_phone} 잘못 입력하셨습니다.`)
            trial_phone2.focus();
            return;
        }
        else if(!rgxPhone.test(trial_phone3.value)){
            alert(`${errorMsg.trial_phone} 잘못 입력하셨습니다.`)
            trial_phone3.focus();
            return;
        }
        else {
            validTest.trial_phone = true;
        }
        // 문의내용 검증
        if(trial_context.value.length <= 0 || trial_context.value.trim() == ""){
            alert(`${errorMsg.trial_context} 잘못 입력하셨습니다.`)
            trial_context.focus();
            return;
        }
        else {
            validTest.trial_context = true;
        }
        // 체크박스 검증
        if(!personal_terms.checked){
            alert(`${errorMsg.personal_terms} 잘못 입력하셨습니다.`)
            personal_terms.focus();
            return;
        }
        else {
            validTest.personal_terms = true;
        }
        // 모든 유효성 검사 값이 true인지 확인하는 함수
        let validChk = (obj) => {
            // 객체만큼 반복문 돌려서
            for (let key in obj) {
                //혹시나 false 인 게 있으면 false.
                if (!obj[key]) {
                    return false;
                }
            }
            //아니면 참
            return true;
        }
    
        // 모든 체크리스트 값이 true 일 때
        if (validChk(validTest)) {
            submitDate3();
            upload.submit();
        } 
        else {
            e.preventDefault(); // 제출 동작 막음
        }
    })
}
