//체크박스를 체크했을 때 -> 해당 input태그들의 value값을 서버에 전달
//체크박스에 하나라도 체크 되있지 않았을 때는  preventDefault()실행 -> 페이지 이동 막음
const board = document.querySelector("#board");
const delBtn = document.querySelector("#selectDelete");

if(delBtn){
    delBtn.addEventListener("click",(event)=>{
        // event.preventDefault(); //페이지 이동 막음
        // board.submit(); //폼태그에서 작성한 데이터를 action속성에 지정한 페이지로 이동,전달
        // 선택삭제를 버튼을 클릭하면 -> 체크되있는 체크박스들의 갯수값을 확인
        // document.querySelectorAll(".delOk:checked")
        // let test = window.confirm("선택한 항목 지울꺼야?");
        let result = window.confirm("선택한 항목들을 삭제하시겠습니까?");
    
        //컨펌화면에서 확인을 눌렀을 때
        if(result){
            //이 안에서 조건문 한번더 체크 (체크박스에 체크했는지 여부 확인)
            if(document.querySelectorAll(".delOk:checked").length > 0){
                alert("선택한 항목들을 삭제하였습니다");
                board.submit();//전송버튼 누른역할 -> /dbseldel 경로로 요청
            }
            else{
                alert("선택한 항목이 없습니다");
                event.preventDefault();
            }
        }
        //컨펌화면에서 취소를 눌렀을 때
        else{
            alert("삭제를 취소하였습니다");
            event.preventDefault();
        }
    })    
}

// 전체선택/해제 체크박스 이벤트
const toggle = document.querySelector("#selectToggle"); // 전체선택/해제 체크박스
const delOk = document.querySelectorAll(".delOk"); //목록에 각각 표시되는 체크박스
if(toggle){
    toggle.addEventListener("click",()=>{
        //toggle의 체크박스 상태를 가지고옴 -> 태그대상.checked
        let checkToggle = toggle.checked;
        //반복문으로 체크박스 class이름에 해당하는 태그들 전부 선택
        //전체선택/해제의 체크상태를 가지고 와서 -> 목록에 있는 체크박스들 전부 선택,해제
        delOk.forEach((item,index)=>{
            item.checked = checkToggle;
        })
    });    
}
