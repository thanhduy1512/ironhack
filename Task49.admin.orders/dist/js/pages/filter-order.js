/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */

$(".col-sm-3").addClass("mt-2");
var gOrderListObject = {
  orderlist: [],
  filterOrders: function (paramFilterObject) {
    var vFilterResult = [];

    vFilterResult = this.orderlist.filter(function (order) {
      return (
        (order.trangThai.toLowerCase() ===
          paramFilterObject.trangThai.toLowerCase() ||
          paramFilterObject.trangThai == 0) &&
        (order.loaiPizza.toLowerCase() ===
          paramFilterObject.loaiPizza.toLowerCase() ||
          paramFilterObject.loaiPizza == 0)
      );
    });

    return vFilterResult;
  },
};

var gSelectStatus = ["open", "confirmed", "cancel"];
var gSelectPizza = ["hawaii", "bacon", "seafood"];

var gColumnName = [
  "orderId",
  "kichCo",
  "loaiPizza",
  "idLoaiNuocUong",
  "thanhTien",
  "hoTen",
  "soDienThoai",
  "trangThai",
  "details",
];

const gORDER_ID_COLUMN = 0;
const gCOMBO_SIZE_COLUMN = 1;
const gPIZZA_TYPE_COLUMN = 2;
const gDRINK_COLUMN = 3;
const gPRICE_COLUMN = 4;
const gFULLNAME_COLUMN = 5;
const gPHONE_COLUMN = 6;
const gSTATUS_COLUMN = 7;
const gDETAIL_COLUMN = 8;

var gOrderTable = $("#order-table").DataTable({
  columns: [
    { data: gColumnName[gORDER_ID_COLUMN] },
    { data: gColumnName[gCOMBO_SIZE_COLUMN] },
    { data: gColumnName[gPIZZA_TYPE_COLUMN] },
    { data: gColumnName[gDRINK_COLUMN] },
    { data: gColumnName[gPRICE_COLUMN] },
    { data: gColumnName[gFULLNAME_COLUMN] },
    { data: gColumnName[gPHONE_COLUMN] },
    { data: gColumnName[gSTATUS_COLUMN] },
    { data: gColumnName[gDETAIL_COLUMN] },
  ],
  columnDefs: [
    {
      targets: gDETAIL_COLUMN,
      defaultContent:
        "<button class='btn btn-primary btn-detail'>Details</button>",
    },
  ],
});

var gOrderId = "";
var gID = 0;
/*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
onPageLoading();

$("#order-table").on("click", ".btn-detail", function () {
  onBtnDetailClick(this);
});

$("#btn-filter").on("click", function () {
  onBtnFilterClick();
});

$("#btn-confirm").on("click", function () {
  onBtnUpdateOrder("confirm");
});
$("#btn-cancel").on("click", function () {
  onBtnUpdateOrder("cancel");
});
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
function onPageLoading() {
  loadOptionsToSelect(gSelectStatus, "status");
  loadOptionsToSelect(gSelectPizza, "pizza");
  // lấy data từ server
  $.ajax({
    url: "http://42.115.221.44:8080/devcamp-pizza365/orders",
    type: "GET",
    dataType: "json",
    success: function (responseObject) {
      gOrderListObject.orderlist = responseObject;
      loadDataToTable(responseObject);
      //console.log(responseObject);
    },
    error: function (error) {
      console.assert(error.responseText);
    },
  });
}

function onBtnDetailClick(paramElement) {
  var vRowSelected = $(paramElement).parents("tr");
  var vRowValue = gOrderTable.row(vRowSelected).data();
  var vID = vRowValue.id;
  var vOrderID = vRowValue.orderId;

  gOrderId = vOrderID;
  gID = vID;
  //console.log(vID, vOrderID);
  $.ajax({
    url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + vOrderID,
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log(res);
      loadDataToModal(res);
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
  $("#detail-modal").modal("show");
}

function onBtnFilterClick() {
  var vFilterObject = {
    trangThai: "",
    loaiPizza: "",
  };
  getDataFilter(vFilterObject);

  var vFilterResult = gOrderListObject.filterOrders(vFilterObject);

  loadDataToTable(vFilterResult);
}

function onBtnUpdateOrder(paramStatus) {
  var vObjectRequest = {
    trangThai: "",
  };
  if (paramStatus == "confirm") {
    vObjectRequest.trangThai = "confirmed";
  } else {
    vObjectRequest.trangThai = "canceled";
  }
  $.ajax({
    url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + gID,
    type: "PUT",
    data: JSON.stringify(vObjectRequest),
    contentType: "application/json;charset=UTF-8",
    success: function (res) {
      console.log(res);
      alert("Update Success!");
      onPageLoading();
      $("#detail-modal").modal("hide");
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình */
function loadDataToTable(paramArray) {
  gOrderTable.clear();
  gOrderTable.rows.add(paramArray);
  gOrderTable.draw();
}

function loadOptionsToSelect(paramArrOptions, typeOfSelect) {
  for (let i = 0; i < paramArrOptions.length; i++) {
    var vMarkup =
      "<option value='" +
      paramArrOptions[i] +
      "'>" +
      paramArrOptions[i] +
      "</option>";
    if (typeOfSelect == "status") {
      $("#select-order-status").append(vMarkup);
    } else {
      $("#select-pizza-type").append(vMarkup);
    }
  }
}

function getDataFilter(paramObj) {
  paramObj.trangThai = $("#select-order-status").val();
  paramObj.loaiPizza = $("#select-pizza-type").val();
}

function loadDataToModal(paramObj) {
  $("#inp-order-id").val(paramObj.orderId);
  $("#select-combo-size").val(paramObj.kichCo.toLowerCase());
  $("#inp-diameter").val(paramObj.duongKinh);
  $("#inp-ribs").val(paramObj.suon);
  $("#inp-drink").val(paramObj.idLoaiNuocUong);
  $("#inp-drink-quantity").val(paramObj.soLuongNuoc);
  $("#inp-voucher-id").val(paramObj.idVourcher);
  $("#inp-pizza-type").val(paramObj.loaiPizza);
  $("#inp-salad").val(paramObj.salad);
  $("#inp-price").val(paramObj.thanhTien);
  $("#inp-discount").val(paramObj.giamGia);
  $("#inp-fullname").val(paramObj.hoTen);
  $("#inp-email").val(paramObj.email);
  $("#inp-phone-number").val(paramObj.soDienThoai);
  $("#inp-address").val(paramObj.diaChi);
  $("#inp-message").val(paramObj.loiNhan);
  $("#inp-order-status").val(paramObj.trangThai);
  $("#inp-create-date").val(paramObj.ngayTao);
  $("#inp-update-date").val(paramObj.ngayCapNhat);
}
