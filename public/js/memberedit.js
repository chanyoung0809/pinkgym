
// 기존비밀번호, 새비밀번호, 비밀번호확인, 전화번호 
const inputprePW = document.querySelector("#prePW");
const inputPW = document.querySelector("#PW");
const inputPW2 = document.querySelector("#PW2");

const userPhone2 = document.querySelector("#userPhone2");
const userPhone3 = document.querySelector("#userPhone3");

// 기존 비밀번호 입력내용 토글 버튼
const pwToggle1 = document.querySelector('#pw_toggle1');
// 비밀번호 수정 입력내용 토글 버튼
const pwToggle2 = document.querySelector('#pw_toggle2');
// 비밀번호 수정확인 입력내용 토글 버튼
const pwToggle3 = document.querySelector('#pw_toggle3');

/* 비밀번호 입력내용 보이게/안보이게 해주는 함수 */
let pwTypeToggle = (passwordInput, passwordToggle)=>{  
    //입력내용 확인 눈모양 아이콘 클릭하면
    passwordToggle.addEventListener('mousedown', ()=> {
        // 패스워드가 보임
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        }
    });
    // 해당 영역에서 마우스가 벗어나거나, 클릭을 해제하면
    // 패스워드가 보이지 않게 함
    passwordToggle.addEventListener('mouseleave', ()=> {
        passwordInput.type = 'password';
    });
    passwordToggle.addEventListener('mouseup', ()=> {
        passwordInput.type = 'password';
    });
}
//비밀번호, 비밀번호확인창에 기능 부여
pwTypeToggle(inputprePW, pwToggle1);
pwTypeToggle(inputPW, pwToggle2);
pwTypeToggle(inputPW2, pwToggle3);

// 문자 입력 막는 함수 numValueValid
let numValueValid = (e)=>{
    const inputValue = e.target.value; // 현재 입력한 값
    const numValue = inputValue.replace(/\D/g, ''); // 입력값을 정규식으로 검사해서, 숫자가 아닌 문자를 제거
    if (numValue !== inputValue) { // 입력받은 값과 숫자로 변환된 값이 같지 않다면
        e.target.value = numValue; //입력된 값을 숫자로 변환값으로 바꿈
    }
}

/* 전화번호 입력 창 키보드 이벤트 */
userPhone2.addEventListener("keyup", (e)=>{
    //4자리 입력하면 다음 인풋태그로 넘어가는 처리
    if(e.target.value.length === 4){
        userPhone3.focus();
    }
})
userPhone3.addEventListener("keyup", (e)=>{
    // 마지막 자리에서 입력값 없을 때 백스페이스 넣으면 이전 인풋태그로 넘어가는 처리
    if(e.target.value == "" && e.key === 'Backspace'){
        userPhone2.focus();
    }
})
userPhone2.addEventListener("input", numValueValid);
userPhone3.addEventListener("input", numValueValid);

// 전송 폼
const submitform = document.querySelector("#memberEdit");
// 전송 버튼
const submitBtn = document.querySelector("#memberEditBtn");
// 비밀번호, 핸드폰번호 정규식
const rgxPW = /^[\w\-\!\*]{10,16}$/;
const rgxPhone =  /^[0-9]{4}$/;
const errorMsg = {
    prepw:"기존 비밀번호를", 
    pw:"비밀번호를", 
    pw2:"비밀번호 확인란을", 
    phone:"핸드폰번호를"
};
// 전송 전 데이터 체크
submitBtn.addEventListener("click", (e) => {
    // 체크 목록 객체
    let checklist = {
        prepw: false,
        pw: false,
        pw2: false,
        phone: false,
    };
    // 기존 비밀번호 체크값이 false면 후속 기능 중단
    if (!rgxCheck(rgxPW, inputprePW, 'prepw', checklist)) return;

    //비밀번호 변경시
    if(inputPW.value !== ""){
        // 비밀번호 체크값이 false면 후속 기능 중단
        if (!rgxCheck(rgxPW, inputPW, 'pw', checklist)) return;
    }
    else{
        checklist['pw'] = true;
    }
    //비밀번호 변경시 확인란
    if(inputPW2.value !== ""){
        // 비밀번호 확인 체크값이 false면 후속 기능 중단
        if (inputPW.value !== inputPW2.value || !rgxCheck(rgxPW, inputPW2, 'pw2', checklist)) return;
    }
    else{
        checklist['pw2'] = true;
    }

    // 전화번호2, 3 체크값이 false면 후속 기능 중단
    if (!rgxPhone.test(userPhone2.value) || !rgxPhone.test(userPhone3.value)) {
        checklist['phone'] = false;
        alert(`${errorMsg['phone']} 확인해주세요`);
        userPhone2.style.borderBottom = ".2vw solid #BF2195";
        userPhone3.style.borderBottom = ".2vw solid #BF2195";
        userPhone2.focus();
        return;
    }
    // 모든 체크리스트 값이 true 일 때
    if (validChk(checklist)) {
        submitform.submit();
    } 
    else {
        e.preventDefault(); // 제출 동작 막음
    }
});

// 정규식 체크 함수
let rgxCheck = (rgx, inputarea, objkey, checklist) => {
    if (rgx.test(inputarea.value)) {
        checklist[objkey] = true;
        inputarea.style.borderBottom = ".2vw solid #2A2A2A";
        return true;
    } else {
        checklist[objkey] = false;
        alert(`${errorMsg[objkey]} 확인해주세요`);
        inputarea.style.borderBottom = ".2vw solid #BF2195";
        inputarea.focus();
        return false;
    }
};

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