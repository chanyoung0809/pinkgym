const postDeleteBtn = document.querySelector("#postDeleteBtn");
// 게시물 내부의 삭제 버튼
if(postDeleteBtn){
    postDeleteBtn.addEventListener("click", (e)=>{
        let deleteConfirm = confirm("게시글 삭제 후 복구가 어렵습니다. 삭제를 진행하시겠습니까?");
        // 삭제 안하겠다고 할 경우만 링크 이동 기능 막기
        if(!deleteConfirm){
            e.preventDefault();
        }
    });
}
