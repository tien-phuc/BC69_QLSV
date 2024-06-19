// Các chức năng sẽ hoàn thành trong bài tập QLSV
/**
 * 1. Thêm sinh viên
 * 2. Hiển thị sinh viên
 * 3. Lưu trữ và hiển thị dữ liệu từ local storages
 * 4. Xoá sinh viên
 * 5. Lấy thông tin sinh viên
 * 6. Cập nhật thông tin sinh viên
 * 7. Validation dữ liệu người dùng
 * 8. Tìm kiếm dựa trên keyword
 * 9. Tạo bộ lọc cho trang QLSV
 */

let arrSinhVien = [];

// hàm lấy dữ liệu từ form
function getValueForm() {
  // viết một xử lí truy cập đến tất cả input và select có trong thẻ form, tạo một vòng lập duyệt qua từng phần tử và hiển thị id và value lên
  let arrField = document.querySelectorAll("#formQLSV input, #formQLSV select");

  // biến giúp kiểm tra có nên trả về 1 đối tượng sinh viên để lưu vào mảng hay không
  let isValid = true;
  // TRUE ==> 1, false ==> 0
  // &= ==> 1 & 1 = 1
  // &= ==> 1 & 0 = 0

  let sinhVien = new SinhVien();
  for (let field of arrField) {
    // destructuring
    let { id, value } = field;
    sinhVien[id] = value;

    // VALIDATION
    // xử lý gọi tới thẻ cha đang chứa thẻ input
    // 1. truy cập vào thẻ cha lớn ở ngoài bằng parentElement
    let parentEle = field.parentElement;
    // 2. từ thẻ cha lớn dùng querySelector tới thẻ span nằm trong thẻ cha
    let errorELe = parentEle.querySelector("span");

    let isValidEmpty = checkEmptyValue(value, errorELe);
    isValid &= isValidEmpty; // 1 &= 0 thì sẽ là 0=>false (không chạy)
    if (!isValidEmpty) {
      continue;
    }
    // kiểm tra thêm một số validation khác
    // nếu kiểm tra điểm thì data-attribute sẽ có giá trị là score

    // 1. Lấy giá trị đang được lưu trữ từ data-validation
    let dataValidation = field.getAttribute("data-validation");
    if (dataValidation == "score") {
      isValid &= checkScoreValue(value, errorELe);
    }

    if (dataValidation == "email") {
      isValid &= checkEmailValue(value, errorELe);
    }
  }
  // kiểm tra xem có nên trả về 1 đối tượng sinh viên hay là không
  if (isValid) {
    return sinhVien;
  }
}

document.getElementById("formQLSV").onsubmit = function (event) {
  // thêm event.preventDefault() vào để sk onsubmit không bị lỗi
  event.preventDefault();
  console.log("Tôi đang submit");

  // lấy tất cả value từ thẻ form
  // (getValueForm sẽ trả về properties hoặc undefined)
  let sinhVien = getValueForm(); // có được hết validation thì có sv được tạo ra còn không sẽ undefined

  // -------------------
  // thêm sinh viên vào mảng arrSinhVien
  // kiểm tra xem được phép thêm 1 sinh viên vào mảng để hiển thị vào table hay không (tương tự ở chức năng update và cập nhật sv vào table)
  // note the conditions: sinhVien không pass được hết dữ lệu tại Validation thì sẽ có giá trị là false - false + (!)thành true - true thì sẽ chạy vào đk if rồi sau đó return ngưng luôn hàm lớn lại
  if (!sinhVien) {
    return;
  }
  arrSinhVien.push(sinhVien);
  console.log(arrSinhVien);
  // clear toàn bộ dữ liệu sau khi người dùng ấn thêm sv
  event.target.reset();

  // ---------------------------
  // hiển thị các sinh viên có trong mảng arrSinhVien vào table
  renderDanhSachSinhVien();

  // ----------------------------
  // Thêm & Lưu trữ dữ liệu vào local Storage
  saveLocalStorage();
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// xây dựng chức năng hiển thị dữ liệu cho người dùng
function renderDanhSachSinhVien(arr = arrSinhVien) {
  let content = "";
  // sử dụng vòng lập để duyệt mảng và hiển thị dữ liệu bằng chuỗi html vào table
  arr.forEach((item, index) => {
    // khi dữ liệu được lưu trữ dưới local, sẽ bị mất phương thức
    console.log(item);
    // Tạo ra đối tượng mới từ lóp đối tượng SinhVien
    // Loacal Storage ==> có dữ liệu nhưng không có phương thức
    // đối tượng mới khởi tạo từ lớp SV ==> có phương thức nhưng không có dữ liệu
    let sinhVien = new SinhVien();
    Object.assign(sinhVien, item);
    console.log(sinhVien);
    // destructuring
    let { txtMaSV, txtTenSV, txtEmail, txtNgaySinh, khSV } = sinhVien;
    content += `
    <tr>
    <td>${txtMaSV}</td>
    <td>${txtTenSV}</td>
    <td>${txtEmail}</td>
    <td>${txtNgaySinh}</td>
    <td>${khSV}</td>
    <td>${sinhVien.tinhDiemTrungBinh().toFixed(3)}</td>
    <td>
    <button onclick = "deleteSinhVien('${txtMaSV}')" type="button" class="btn btn-danger ">Xóa</button>
    <button onclick = "getInfoSinhVien('${txtMaSV}')" type="button"class="btn btn-warning ">Sửa</button>
    </td>
  </tr>
    `;
  });
  document.getElementById("tbodySinhVien").innerHTML = content;
}

// ==================================
// Chức năng LƯU dữ liệu vào local Storage
function saveLocalStorage(key = "arrSinhVien", value = arrSinhVien) {
  // chuyển đổi từ object hoặc array sang chuỗi

  // lưu ý sau này kiểm tra dữ liệu
  // if (typeof value == "object") {
  //   let stringJson = JSON.stringify(value);
  //   localStorage.setItem(key, stringJson);
  // } else {
  //   localStorage.setItem(key, value);
  // }

  let stringJson = JSON.stringify(value);
  localStorage.setItem(key, stringJson);
}

// ==================================
// Chức năng LẤY dữ liệu vào local Storage
function getLocalStorage(key = "arrSinhVien") {
  let dataLocal = localStorage.getItem(key);
  if (dataLocal) {
    // chuyển dữ liệu từ chuỗi JSON về object
    let reverseData = JSON.parse(dataLocal);
    arrSinhVien = reverseData;
    // gọi hàm renderDanhSachSinhVien() để hiển thị lại dữ liệu
    renderDanhSachSinhVien();
  }
}
getLocalStorage();

// ==================================
// Chức năng xóa sinh viên
function deleteSinhVien(mssv) {
  console.log(mssv);
  console.log(arrSinhVien);
  // tìm kiếm sinh viên trong mảng thông qua mssv
  // splice(vị trị bắt đầu xóa, sl phần tử cần xóa = 1)
  // xóa xong, chạy hiển thị lại dữ liệu và lưu trữ xuống local
  let index = arrSinhVien.findIndex((item, index) => item.txtMaSV == mssv);
  console.log(index);

  // bước kiểm tra nếu biến index có giá trị khác -1 thì mới xử lí
  if (index != -1) {
    arrSinhVien.splice(index, 1);
    // lưu ý khi xóa xong gọi lại hàm renderDanhSachSinhVien để hiện dữ liệu lên
    renderDanhSachSinhVien();
    // gọi hàm saveLocalStorage để khi xóa trên giao diện thì hàm này sẽ lưu dữ liệu mới vô localStorage
    saveLocalStorage();
  }
}

// ==================================
// chức năng NÚT SỬA
function getInfoSinhVien(mssv) {
  console.log(mssv);
  // tìm kiếm phần tử người dùng cần sửa trong mảng
  // thực hiện đưa dữ liệu lên giao diện cho người dùng
  // ngăn chặn người dùng chỉnh sửa input mã SV bằng readOnly
  let sinhVien = arrSinhVien.find((item, index) => {
    return item.txtMaSV == mssv;
  });
  if (sinhVien) {
    // thực hiên đưa dữ liệu lên giao diện người dùng
    console.log(sinhVien);
    // document.getElementById("txtMaSV").value = sinhVien.txtMaSV;
    let arrField = document.querySelectorAll(
      "#formQLSV input, #formQLSV select"
    );
    for (let field of arrField) {
      console.log(field);
      // tên thuộc tính lúc đầu đặt trùng với id của input nên ta có thể
      // note: đối tượng sinhVien khởi tạo từ class SinhVien nên có thuộc tính giống với nó và sau đó các id của thẻ input cũng có id giống với thuộc tính của class
      let id = field.id; //txtMaSV , txtTenSV
      // note: thuộc tính value của input 1 sẽ được gán giá trị từ thuộc tính 1 của đối tượng sinhVien
      field.value = sinhVien[id];
      if (field.id == "txtMaSV") {
        field.readOnly = true;
      }
    }
  }
}

// chức năng NÚT CẬP NHẬT
function updateSinhVien() {
  // lấy dữ liệu từ form
  let sinhVien = getValueForm();
  if (!sinhVien) {
    return;
  }
  console.log(sinhVien);
  // tìm kiếm tới vị trí của dữ liệu cũ và thay thế cụ
  let index = arrSinhVien.findIndex((item, index) => {
    // trả về vị trí index của item nào có thuộc tính txtMaSV trùng với thuộc tính txtMaSV của đối tượng sinhVien
    return item.txtMaSV == sinhVien.txtMaSV;
  });
  console.log("index: ", index);

  if (index != -1) {
    arrSinhVien[index] = sinhVien;
    renderDanhSachSinhVien();
    saveLocalStorage();
  }
  // reset lại input sau khi người dùng đã chỉnh sửa và ấn vào cập nhật
  document.getElementById("formQLSV").reset();

  // sau khi ấn nút sửa thì input nhập maSV bị khóa thì sau khi ấn nút cập nhật phải mở khóa
  document.getElementById("txtMaSV").readOnly = false;
  // document.getElementById("txtMaSV").removeAttribute("readOnly");
}
document.querySelector(".btn-info").onclick = updateSinhVien;

// ======================================
// chức năng tìm kiếm
// chuyển đổi chữ hoa thành chữ thường && xóa bỏ hết dấu câu tiếng việt && xóa bỏ khoảng trắng giữa các chữ cái
function seachSinhVien(event) {
  console.log("event: ", event.target.value);
  // format lại dữ liệu
  const newKeyWord = removeVietnameseTones(
    event.target.value.toLowerCase().trim()
  );
  console.log("newKeyWord: ", newKeyWord);
  // tạo 1 mảng phụ
  let arrSeachSinhVien = arrSinhVien.filter((item, index) => {
    // format lại dữ liệu của tên sinh viên
    const newTenSinhVien = removeVietnameseTones(
      item.txtTenSV.toLowerCase().trim()
    );
    // includes() giúp hiện ra object chứa keyword
    // "Tiến Phúc" ==> "z" ===> false
    return newTenSinhVien.includes(newKeyWord);
  });
  console.log("arrSeachSinhVien: ", arrSeachSinhVien);
  renderDanhSachSinhVien(arrSeachSinhVien);
}
document.getElementById("txtSearch").oninput = seachSinhVien;

// -----------------------
// học tương tác với local storage
// setItem ==> thêm
// let sinhVienPro = {
//   hoTen: "Long",
//   tuoi: 25,
// };
// let chuoiJSON = JSON.stringify(sinhVienPro);
// console.log(chuoiJSON);
// // Key ==> tên thuôc tính
// // Value ==> dữ liệu chuỗi cần lưu trữ
// localStorage.setItem("sinhVienPro", chuoiJSON);

// // getItem ==> lấy
// let dataLocal = localStorage.getItem("sinhVienPro"); // Key: sinhVienPro trong local Storage
// let reverseDataLoCal = JSON.parse(dataLocal);
// console.log(reverseDataLoCal.tuoi);

// // remove ==> xóa
// localStorage.removeItem("sinhVienPro"); // Key
