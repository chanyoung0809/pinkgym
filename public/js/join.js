// 전체동의, 비동의
const allchk = document.querySelector("#all_chk");
const chks = document.querySelectorAll(".terms > div .checkbox_wrap .checkbox");

// 아이디, 비밀번호, 비밀번호확인, 주민번호앞자리, 주민번호뒷자리(성별), 휴대폰번호 앞4자리, 뒷4자리 입력칸
const inputID = document.querySelector("#ID");
const inputPW = document.querySelector("#PW");
const inputPW2 = document.querySelector("#PW2");
const userBirth = document.querySelector("#userBirth");
const userGender = document.querySelector("#userGender");
const userPhone2 = document.querySelector("#userPhone2");
const userPhone3 = document.querySelector("#userPhone3");

//전체동의 체크박스 눌렀을 때
allchk.addEventListener("change", (e)=>{
    if(e.target.checked){
        Array.from(chks).forEach((chk)=>{
            chk.checked = true;    
            chk.parentNode.previousElementSibling.classList.add("checked");
            inputID.focus();
        });
    }
    else{
        Array.from(chks).forEach((chk)=>{
            chk.checked = false;
            chk.parentNode.previousElementSibling.classList.remove("checked");          
        });
    }
});
//각각의 체크박스 눌렀을 때
Array.from(chks).forEach((chk, i)=>{
    chk.addEventListener("change", (e)=>{
        if(e.target.checked){
            chk.parentNode.previousElementSibling.classList.add("checked"); 
        }
        else{
            chk.parentNode.previousElementSibling.classList.remove("checked"); 
        }
        if(chks[0].checked && chks[1].checked){
            allchk.checked = true;
            inputID.focus();
        }
        else{
            allchk.checked = false;
        }
    });
});

// 전송 버튼
const submitBtn = document.querySelector(".join_wrap > form > button");
// 아이디, 비밀번호, 생년월일, 성별, 핸드폰번호 정규식
const rgxID = /^[\w-]{8,12}$/;
const rgxPW = /^[\w\-\!\*]{10,16}$/;
// 비밀번호확인은 기존 비밀번호 검증식으로 검증
const rgxBirth = /^[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;
const rgxGender = /^(2|4){1}$/;
const rgxPhone =  /^[0-9]{4}$/;
const errorMsg = {
    checkboxes:"이용약관 체크박스를",
    id:"아이디를", 
    pw:"비밀번호를", 
    pw2:"비밀번호 확인란을", 
    birth:"주민등록번호 앞자리를", 
    gender:"주민등록번호 뒷자리를", 
    phone:"핸드폰번호를"
};
// 전송 전 데이터 체크
submitBtn.addEventListener("click", (e)=>{
    // 기본 전송 기능 막고
    e.preventDefault();
    // 체크 목록 객체
    let checklist = {
        checkboxes:false,
        id:false,
        pw:false,
        pw2:false, 
        birth:false,
        gender:false,
        phone:false
    }
    //아이디 체크
    rgxCheck(rgxID, inputID, id);
    // 비밀번호 체크
    rgxCheck(rgxPW, inputPW, pw);
    // 비밀번호 확인 체크
    if(inputPW === inputPW2){
        rgxCheck(rgxPW, inputPW2, pw2);
    }
    // 생년월일 확인 체크
    rgxCheck(rgxBirth, userBirth, birth);
});

let rgxCheck = (rgx, inputarea, objkey)=>{
    if(rgx.test(inputarea.value)){
        checklist.objkey = true;
        inputarea.style.borderBottom=".2vw solid #2A2A2A";
    } 
    else{
        checklist.objkey = false;
        alert(`${errorMsg.objkey} 확인해주세요`);
        inputPW.style.borderBottom=".2vw solid #BF2195";
        inputPW.focus();
        return;
    }
}

