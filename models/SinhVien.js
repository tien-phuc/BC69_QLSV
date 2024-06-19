// khởi tạo một lớp đối tượng sinh viên cho bài tập quản lí sinh viên
class SinhVien {
  txtMaSV = "";
  txtTenSV = "";
  txtEmail = "";
  txtPass = "";
  txtNgaySinh = "";
  khSV = "";
  txtDiemToan = "";
  txtDiemLy = "";
  txtDiemHoa = "";

  tinhDiemTrungBinh = function () {
    return (
      (this.txtDiemToan * 1 + this.txtDiemHoa * 1 + this.txtDiemLy * 1) / 3
    );
  };
}
