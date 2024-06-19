// Kiểm tra không bỏ trống input
// value, tương tác truy cập tới thẻ sẽ chứa nội dung thông báo
function checkEmptyValue(value, errorEle) {
  if (value == "") {
    // người dùng chưa nhập dữ liệu
    errorEle.innerHTML = "Vui lòng không bỏ trống trường này";
    return false;
  } else {
    errorEle.innerHTML = "";
    return true;
  }
}

function checkEmailValue(value, errorELe) {
  const regexEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const isValid = regexEmail.test(value); // trả về true or false
  if (!isValid) {
    // xử lí thông báo lỗi
    errorELe.innerHTML = "Vui lòng nhập đúng định dạng email";
    return false;
  } else {
    // xử lí xóa tb lỗi
    errorELe.innerHTML = "";
    return true;
  }
}

function checkScoreValue(value, errorELe) {
  // Kiểm tra xem value có phải là số hay không và có nằm trong khoảng từ 0 đến 10 hay không
  let regexScore = /^(10|\d(\.\d)?)$/;
  const isValid = regexScore.test(value);
  if (!isValid) {
    errorELe.innerHTML = "Vui lòng nhập số điểm từ 0 đến 10";
    return false;
  } else {
    errorELe.innerHTML = "";
    return true;
  }
}

function checkPhoneNumberValue(value, errorELe) {
  const regexPhoneNumber = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
  const isValid = regexPhoneNumber.test(value); // true or false
  if (!isValid) {
    // xử lí thông báo lỗi
    errorELe.innerHTML = "Vui lòng nhập đúng định dạng SĐT VN";
    return false;
  } else {
    // xử lí xóa tb lỗi
    errorELe.innerHTML = "";
    return true;
  }
}
