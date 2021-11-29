"use strict";
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
var gREADY_STATE_REQUEST_DONE = 4;
var gSTATUS_REQUEST_DONE = 200;

/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
// Hàm này để xử lý sự kiện nút check voucher click
function onBtnCheckVoucherClick() {
  // B1: lấy giá trị nhập trên form, mã voucher (Thu thập dữ liệu)
  var vVoucherCodeElement = $("#voucher");
  var vVoucherCode = vVoucherCodeElement.val().trim();
  // B2: Validate data
  var vIsValidateData = validateData(vVoucherCode);
  if (vIsValidateData) {
    // B3: Tạo request và gửi mã voucher về server
    var bXmlHttp = new XMLHttpRequest();
    sendVoucherToServer(vVoucherCode, bXmlHttp);
    // B4: xu ly response khi server trả về
    bXmlHttp.onreadystatechange = function () {
      if (
        bXmlHttp.readyState === gREADY_STATE_REQUEST_DONE &&
        bXmlHttp.status === gSTATUS_REQUEST_DONE
      ) {
        processResponse(bXmlHttp);
      }
    };
  }
}

/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
// Hàm này dùng để validate data
// input: ma voucher nguoi dung nhap vao
// output: tra ve true neu ma voucher duoc nhap, nguoc lai thi return false
function validateData(paramVoucher) {
  var vResultCheckElement = $("#div-result-check");
  if (paramVoucher === "") {
    // Hiển thị câu thông báo lỗi ra
    vResultCheckElement.text("Mã giảm giá chưa nhập!");
    // Thay đổi class css, để đổi màu chữ thành màu đỏ
    vResultCheckElement.prop("class", "text-danger");
    return false;
  }

  // Thay đổi class css, để đổi màu chữ thành màu đen bình thường
  vResultCheckElement.prop("class", "text-dark");
  return true;
}

// Ham thuc hien viec call api va gui ma voucher ve server
function sendVoucherToServer(paramVoucher, paramXmlVoucherRequest) {
  paramXmlVoucherRequest.open(
    "GET",
    "http://42.115.221.44:8080/devcamp-voucher-api/vouchers/" + paramVoucher,
    true
  );
  paramXmlVoucherRequest.send();
}

// Hàm này được dùng để xử lý khi server trả về response
function processResponse(paramXmlHttp) {
  // B1: nhận lại response dạng JSON ở xmlHttp.responseText
  var vJsonVoucherResponse = paramXmlHttp.responseText;
  // B2: Parsing chuỗi JSON thành Object
  var vVoucherResObj = JSON.parse(vJsonVoucherResponse);
  console.log(vJsonVoucherResponse);
  // B3: xử lý mã giảm giá dựa vào đối tượng vừa có
  var vDiscount = vVoucherResObj.discount;
  var vResultCheckElement = $("#div-result-check");
  //discount - -1 nghĩa là mã giảm giá không tồn tại
  if (vDiscount === "-1") {
    vResultCheckElement.text("Không tồn tại mã giảm giá");
  } else {
    vResultCheckElement.text("Mã giảm giá " + vDiscount + "%");
  }
}
