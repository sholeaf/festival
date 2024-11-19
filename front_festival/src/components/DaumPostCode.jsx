import { useDaumPostcodePopup } from 'react-daum-postcode';

const DaumPostCode = ({defaultValue}) => {
    const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

    const handleComplete = (data) => {
        // 팝업에서 검색결과 항목을 클릭했을 때 실행할 코드를 작성하는 부분

        let fullAddress = data.address;
        let extraAddress = '';

        console.log("데이터 확인",data);


        //사용자가 선택한 주소 타입에 따라 해당 주소값을 가져온다.
        if (data.addressType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            //법정동 명이 있을 경우
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            //건물 명이 있을 경우
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }
        document.getElementById("zipcode").value = data.zonecode;
        document.getElementById("addr").value = data.address;
        document.getElementById("addrdetail").value = "";
        document.getElementById("addrdetail").focus();
        document.getElementById("addretc").value = extraAddress !== '' ? `(${extraAddress})` : '';
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <>
          {/* 우편번호 input에 클릭 시 handleClick() 호출 */}
          <input
            type="text"
            name="zipcode"
            id="zipcode"
            placeholder="우편번호"
            readOnly
            onClick={handleClick} // 클릭 시 handleClick 실행
            defaultValue={defaultValue}
          />
        </>
      );
}
export default DaumPostCode;