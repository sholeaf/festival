import axios from "axios";

const ClickBookmark = (contentid, bmlist, setBmlist, userid, setSampleData) => {
    if (userid == '' || userid == null) {
        alert("로그인을 해야 즐겨찾기가 가능합니다.");
        return;
    }
    if (bmlist.includes(contentid)) {
        axios.delete(`/api/bookmark/removeBookmark`, { params: { contentid: contentid, userid: userid } })
            .then((resp) => {
                if (resp.data == "o") {
                    setBmlist(bmlist.filter(id => id !== contentid));
                    alert("즐겨찾기가 해제되었습니다.");
                    setSampleData(bmlist.filter(id => id !== contentid));
                }
                if (resp.data == "x") {
                    alert("오류가 발생했습니다.");
                }
            })
            .catch((error => {
                console.log(error);
            }))
    }
    else {
        axios.post(`/api/bookmark/addBookmark`, {contentid: contentid, userid: userid })
            .then((resp) => {
                console.log("contentid 추가 : ",contentid);
                console.log("userid 추가 : ",userid);
                if (resp.data == "o") {
                    setBmlist([...bmlist, contentid]);
                    alert("즐겨찾기가 추가되었습니다.");
                    setSampleData([...bmlist, contentid]);
                }
                if (resp.data == "x") {
                    alert("오류가 발생했습니다.");
                }
            })
            .catch((error => {
                console.log(error);
            }))
    }
}


export default ClickBookmark;