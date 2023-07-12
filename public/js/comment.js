const commentform = document.querySelector("#commentSubmit");
const commentBtn = document.querySelector("#commentSubmit > button");
const commentAuthor = document.querySelector("#comment_author");
const commentContent = document.querySelector("#comment_content");
const commentDate = document.querySelector("#comment_date");
commentBtn.addEventListener("click", (e)=>{
    if (commentContent.value !== ""){
        submitDate2();
        commentform.submit();
    }
    else {
        e.preventDefault();
        alert("댓글 내용을 입력하지 않으셨습니다.");
        commentContent.focus();
    } 
});

const commentdate= document.querySelector("#comment_date"); //댓글 작성일 삽입 위한 변수

let submitDate2 = ()=>{ // 댓글 작성 날짜 삽입 위한 함수
    let date = new Date(); // Date 생성
    let year = date.getFullYear(); // 작성연도
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // 작성월(1~9 : 01~09 / 10~12 : 010~012, slice로 뒤부터 2글자 잘라냄)
    let day = ("0" + date.getDate()).slice(-2); // 작성일(1~9 : 01~09 / 10~31 : 010~031, slice로 뒤부터 2글자 잘라냄)
    let hour = ("0" + date.getHours()).slice(-2); // 작성시
    let minute = ("0" + date.getMinutes()).slice(-2); //작성분
    let writeDate = `${year}-${month}-${day} ${hour}:${minute}`; 
    // 최종 삽입할 작성연월일시분 (yyyy-mm-dd ho:mn형식)
    
    commentdate.value = writeDate; //작성일자 인풋 태그 값으로 작성일자 값 저장.
}

// 작성된 댓글들
const comments = document.querySelectorAll(".comments_wrap .comment");
// 수정처리할 form
const commentEditForms = document.querySelectorAll(".comments_wrap .comment > form");
// 수정 DB처리 (버튼태그)
const commentChangeBtns = document.querySelectorAll(".comments_wrap .comment > form .commentChangeBtn");
// 삭제 DB처리 (a태그)
const commentDeleteBtns = document.querySelectorAll(".comments_wrap .comment .commentDeleteBtn");
// 댓글 내용(textarea 태그, readonly 속성 토글해서, 해당 자리에서 수정 가능하도록 처리)
const commentContents = document.querySelectorAll(".comments_wrap .comment > form .comment_content");
// 댓글내용 수정/중간에 관두고 싶으면 취소로 바뀔 버튼
const commentEditBtns = document.querySelectorAll(".comments_wrap .comment .commentEditBtn");

// 수정/수정취소 토글 버튼 이벤트
Array.from(commentEditBtns).forEach((commentEditBtn, idx)=>{
    commentEditBtn.addEventListener("click", ()=>{
        // 수정 버튼 클릭할 경우
        commentContents[idx].readOnly = !commentContents[idx].readOnly;
        // textarea의 readOnly 속성 변화시킴(수정가능/불가능하게)
        if(!commentContents[idx].readOnly){
            // 입력란 스타일 변화시키고
            commentContents[idx].style.border = "1px solid #2A2A2A";
            commentChangeBtns[idx].style.display = "inline-block";
            //입력란의 맨 끝에 포커싱
            commentContents[idx].focus();
            commentContents[idx].selectionStart = commentContents[idx].value.length;
            commentContents[idx].selectionEnd = commentContents[idx].value.length;
            // 토글 버튼의 텍스트 변경
            commentEditBtn.innerText = "취소";
        }
        else {
            //입력란 스타일 변화시키고
            commentContents[idx].style.border = "none";
            commentChangeBtns[idx].style.display = "none";
            // 토글 버튼의 텍스트 변경
            commentEditBtn.innerText = "수정";
        }
    });
});

// 댓글 삭제 처리시, 진짜 삭제 할거냐고 물어보기.
Array.from(commentDeleteBtns).forEach((commentDeleteBtn, idx)=>{
    commentDeleteBtn.addEventListener("click", (e)=>{
        let delCheck = confirm("댓글을 삭제하시겠습니까?");
        if(!delCheck){
            // 아니오 응답에는 삭제 처리 막기
            e.preventDefault();
        }   
    });
});

