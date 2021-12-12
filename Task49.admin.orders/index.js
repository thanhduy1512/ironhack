/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
// API
// can GET all, GET by ID, UPDATE, CREATE, DELETE
const gAPI_ALL_ORDERS = "http://42.115.221.44:8080/devcamp-pizza365/orders/";
const gAPI_DRINKS = "http://42.115.221.44:8080/devcamp-pizza365/drinks";
const gAPI_CHECK_VOUCHER_ID =
  "http://42.115.221.44:8080/devcamp-voucher-api/voucher_detail/";
const gAPI_CREATE_ORDER = "http://42.115.221.44:8080/devcamp-pizza365/orders";

var gFORM_MODE_NORMAL = "Normal";
var gFORM_MODE_INSERT = "Insert";
var gFORM_MODE_UPDATE = "Update";
var gFORM_MODE_DELETE = "Delete";
// biến toàn cục cho trạng thái của form: mặc định ban đầu là trạng thái Normal
var gFormMode = gFORM_MODE_NORMAL;

var gPizzasList = [
  { type: "seafood", display: "Hải Sản" },
  { type: "hawaii", display: "Hawaii" },
  { type: "bacon", display: "Thịt Hun Khói" },
];

var gOrderStatusList = [
  { type: "open", display: "Open" },
  { type: "cancel", display: "Cancelled" },
  { type: "confirmed", display: "Confirmed" },
];

// Order input
var gComboSize = [];
var gPizzaType = "0";
var gSelectedDrink = "0";
var gVoucherId = "";
var gDiscount = "";
var gID = 0;
var gOrderID = 0;

// Fixed combo
var gCombosList = [
  {
    menuName: "S",
    duongKinhCM: 20,
    suongNuong: 2,
    saladGr: 200,
    drink: 2,
    priceVND: 150000,
  },
  {
    menuName: "M",
    duongKinhCM: 25,
    suongNuong: 4,
    saladGr: 300,
    drink: 3,
    priceVND: 200000,
  },
  {
    menuName: "L",
    duongKinhCM: 30,
    suongNuong: 8,
    saladGr: 500,
    drink: 4,
    priceVND: 250000,
  },
];

var gOrderObject = {
  orders: [],
  filterOrder: function (paramFilter) {
    var vFilteredArr = this.orders.filter(function (order) {
      return (
        (order.loaiPizza == paramFilter.loaiPizza ||
          paramFilter.loaiPizza == 0) &&
        (order.trangThai.includes(paramFilter.trangThai) ||
          paramFilter.trangThai == 0)
      );
    });
    return vFilteredArr;
  },
  validateData: function (paramOrder) {
    if (paramOrder.kichCo == 0) {
      alert("Choose Combo Size");
      return false;
    }
    if (paramOrder.loaiPizza == 0) {
      alert("Choose Pizza Type");
      return false;
    }
    if (paramOrder.idLoaiNuocUong == 0) {
      alert("Choose Drink");
      return false;
    }
    if (paramOrder.hoTen.trim() == "") {
      alert("Provide Full Name");
      return false;
    }
    if (paramOrder.email.trim() == "") {
      alert("Provide Email");
      return false;
    }
    if (!paramOrder.email.includes("@") || !paramOrder.email.includes(".")) {
      alert("Wrong Email Format");
      return false;
    }
    if (paramOrder.soDienThoai.trim() == "") {
      alert("Provide Phone Number");
      return false;
    }
    if (paramOrder.diaChi.trim() == "") {
      alert("Provide Address");
      return false;
    }
    return true;
  },
  saveOrder: function (paramOrder) {
    if (gFormMode == gFORM_MODE_INSERT) {
      callApiCreateOrder(paramOrder);
    }
  },
  updateOrderStatus: function (paramOrderStatus) {
    if (paramOrderStatus == "confirm") {
      callApiUpdateOrderStatus("confirm");
    } else {
      callApiUpdateOrderStatus("cancel");
    }
  },
};

// Data table cols
const gORDER_COLS = [
  "orderId",
  "hoTen",
  "kichCo",
  "loaiPizza",
  "trangThai",
  "actions",
];
const gORDER_ID_COL = 0;
const gFULL_NAME_COL = 1;
const gCOMBO_SIZE_COL = 2;
const gPIZZA_TYPE_COL = 3;
const gSTATUS_COL = 4;
const gACTIONS_COL = 5;

var gDataTable = $("#orders-table").DataTable({
  ordering: false,
  columns: [
    { data: gORDER_COLS[gORDER_ID_COL] },
    { data: gORDER_COLS[gFULL_NAME_COL] },
    { data: gORDER_COLS[gCOMBO_SIZE_COL] },
    { data: gORDER_COLS[gPIZZA_TYPE_COL] },
    { data: gORDER_COLS[gSTATUS_COL] },
    { data: gORDER_COLS[gACTIONS_COL] },
  ],
  columnDefs: [
    {
      // định nghĩa lại cột action
      targets: gACTIONS_COL,
      defaultContent: `
      <i class="fas fa-edit edit-order text-primary" style="width: 30px;cursor:pointer;"></i>
      <i class="fas fa-eraser delete-order text-danger" style="width: 30px;cursor:pointer;"></i>
      `,
    },
  ],
});
/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */
$(document).ready(function () {
  onPageLoading();

  $("#btn-add-new").on("click", function () {
    onBtnNewOrderClick();
  });

  $("#btn-filter").on("click", function () {
    onBtnFilterClick();
  });

  $("#select-combo").on("change", function () {
    var vComboValue = $(this).val();
    onSelectComboChange(vComboValue);
  });

  $(".select-pizza")
    .eq(1)
    .on("change", function () {
      gPizzaType = $(this).val();
    });

  $("#select-drink").on("change", function () {
    gSelectedDrink = $(this).val();
  });

  $("#btn-add-new").on("click", function () {
    onBtnAddNewClick();
  });

  $("#add-modal").on("click", "#btn-save", function () {
    onBtnSaveClick();
  });

  $("#orders-table").on("click", ".edit-order", function () {
    onBtnEditClick(this);
  });

  $("#orders-table").on("click", ".delete-order", function () {
    onBtnDeleteClick(this);
  });

  $("#add-modal").on("click", ".btn-confirm", function () {
    gOrderObject.updateOrderStatus("confirm");
    onBtnConfirmUpdateClick();
  });

  $("#add-modal").on("click", ".btn-cancel", function () {
    gOrderObject.updateOrderStatus("cancel");
    onBtnConfirmUpdateClick();
  });

  $("#add-modal").on("click", "#btn-close", function () {
    resetModalData();
  });

  $("#delete-modal").on("click", "#btn-confirm-delete", function () {
    onBtnConfirmDeleteClick(gID);
  });
});
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */

function onPageLoading() {
  loadDataToSelect(gPizzasList, "pizza");
  loadDataToSelect(gOrderStatusList, "status");
  loadDataToSelect(gCombosList, "combo");
  //load data to table by api
  callApiGetAllOrders();
  //load drink to select by api
  callApiGetDrinks();
}

function onBtnNewOrderClick() {
  gFormMode = gFORM_MODE_INSERT;
  $("#div-form-mod").html(gFormMode);
  $("#add-modal").modal("show");
}

function onBtnFilterClick() {
  var vFilterObject = {
    loaiPizza: $(".select-pizza").first().val(),
    trangThai: $(".select-status").val(),
  };
  var vFilteredArr = gOrderObject.filterOrder(vFilterObject);

  loadDataToTable(vFilteredArr);
}

function onBtnAddNewClick() {
  gFormMode = gFORM_MODE_INSERT;
  $("#div-form-mod").html(gFormMode);
  $("#add-modal .modal-footer #btn-save").remove();
  $("#add-modal .modal-footer .btn-confirm").remove();
  $("#add-modal .modal-footer .btn-cancel").remove();
  var vSaveBtn = $("<button/>")
    .addClass("btn btn-primary")
    .prop("id", "btn-save")
    .text("Save Data");

  $("#add-modal .modal-footer").append(vSaveBtn);
  $("#add-edit-modal").modal("show");
}

function onBtnEditClick(paramIcon) {
  gFormMode = gFORM_MODE_UPDATE;
  $("#div-form-mod").html(gFormMode);
  gID = getIdDataFromButton(paramIcon)[0];
  gOrderID = getIdDataFromButton(paramIcon)[1];
  callApiGetOrderByOrderID(gOrderID);
  $("#add-modal").modal("show");
}

function onBtnDeleteClick(paramIcon) {
  gFormMode = gFORM_MODE_DELETE;
  $("#div-form-mod").html(gFormMode);
  gID = getIdDataFromButton(paramIcon)[0];
  $("#delete-modal").modal("show");
}

function onBtnSaveClick() {
  // get data
  var vOrder = {
    kichCo: $("#select-combo").val(),
    duongKinh: "",
    suon: "",
    salad: "",
    soLuongNuoc: "",
    thanhTien: "",
    loaiPizza: gPizzaType,
    idVoucher: $("#input-voucher").val(),
    idLoaiNuocUong: gSelectedDrink,
    hoTen: $("#input-fullname").val(),
    email: $("#input-email").val(),
    soDienThoai: $("#input-phone").val(),
    diaChi: $("#input-address").val(),
    loiNhan: $("#input-message").val(),
  };
  if (vOrder.kichCo != 0) {
    vOrder.duongKinh = gComboSize[0].duongKinhCM;
    vOrder.suon = gComboSize[0].suongNuong;
    vOrder.salad = gComboSize[0].saladGr;
    vOrder.soLuongNuoc = gComboSize[0].drink;
    vOrder.thanhTien = gComboSize[0].priceVND;
  }

  if (vOrder.idVoucher != "") {
    gVoucherId = vOrder.idVoucher;
    callApiCheckVoucherId();
  } else {
    gVoucherId = 0;
  }

  // validate data
  var vIsValid = gOrderObject.validateData(vOrder);

  //process data
  if (vIsValid) {
    //create or update order
    gOrderObject.saveOrder(vOrder);
    //reload datatable
    callApiGetAllOrders();
    $("#add-modal").modal("hide");
    $("#order-success-modal").modal("show");
    //element info of voucher
    $("#order-success-modal .modal-body p").remove();
    var vElementVoucher = $("<p/>").text(
      "You have " + gDiscount + "% discount"
    );
    $("#order-success-modal .modal-body").append(vElementVoucher);
    resetModalData();
  }
}

function onBtnConfirmUpdateClick() {
  resetModalData();

  $("#add-modal .btn-confirm").remove();
  $("#add-modal .btn-cancel").remove();

  callApiGetAllOrders();
  $("#add-modal").modal("hide");
  alert("Update Order Status Success");
}

function onBtnConfirmDeleteClick(paramID) {
  callApiDeleteOrder(paramID);
  alert("Delete Success");
  $("#delete-modal").modal("hide");
  callApiGetAllOrders();
}
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/

function loadDataToSelect(paramArr, paramCondition) {
  var vSelect = "";

  for (let i = 0; i <= paramArr.length - 1; i++) {
    var vValue = paramArr[i].type;
    var vText = paramArr[i].display;

    if (paramCondition == "pizza") {
      vSelect = ".select-pizza";
    } else if (paramCondition == "status") {
      vSelect = ".select-status";
    } else if (paramCondition == "drink") {
      vSelect = "#select-drink";
      vValue = paramArr[i].maNuocUong;
      vText = paramArr[i].tenNuocUong;
    } else if (paramCondition == "combo") {
      vSelect = "#select-combo";
      vValue = paramArr[i].menuName;
      vText = paramArr[i].menuName;
    }

    let vOption = $("<option/>").val(vValue).text(vText);
    $(vSelect).append(vOption);
  }
}

function loadDataToTable(paramArr) {
  gDataTable.clear();
  gDataTable.rows.add(paramArr);
  gDataTable.draw();
}

function onSelectComboChange(paramValue) {
  var vSelectedCombo = gCombosList.filter(function (combo) {
    return combo.menuName == paramValue;
  });
  gComboSize = vSelectedCombo;
  loadComboData(vSelectedCombo);
}

function loadComboData(paramCombo) {
  if (paramCombo.length == 1) {
    $("#input-diameter").val(paramCombo[0].duongKinhCM);
    $("#input-ribs").val(paramCombo[0].suongNuong);
    $("#input-salad").val(paramCombo[0].saladGr);
    $("#input-drink-quantity").val(paramCombo[0].drink);
    $("#input-price").val(paramCombo[0].priceVND.toLocaleString());
  } else {
    $("#input-diameter").val("");
    $("#input-ribs").val("");
    $("#input-salad").val("");
    $("#input-drink-quantity").val("");
    $("#input-price").val("");
  }
}

function getIdDataFromButton(paramIcon) {
  var vTableRow = $(paramIcon).parents("tr");
  var vOrderRowData = gDataTable.row(vTableRow).data();
  return [vOrderRowData.id, vOrderRowData.orderId];
}

function loadDataToModal(paramOrder) {
  $("#select-combo").val(paramOrder.kichCo).prop("disabled", true);
  onSelectComboChange(paramOrder.kichCo);
  $(".select-pizza")
    .eq(1)
    .val(paramOrder.loaiPizza.toLowerCase())
    .prop("disabled", true);
  $("#input-voucher").val(paramOrder.idVourcher).prop("disabled", true);
  $("#select-drink").val(paramOrder.idLoaiNuocUong).prop("disabled", true);
  $("#input-fullname").val(paramOrder.hoTen).prop("disabled", true);
  $("#input-email").val(paramOrder.email).prop("disabled", true);
  $("#input-phone").val(paramOrder.soDienThoai).prop("disabled", true);
  $("#input-address").val(paramOrder.diaChi).prop("disabled", true);
  $("#input-message").val(paramOrder.loiNhan).prop("disabled", true);

  $("#add-modal .btn-confirm").remove();
  $("#add-modal .btn-cancel").remove();
  var vConfirmBtn = $("<button/>")
    .addClass("btn-confirm btn btn-success")
    .text("Confirm");
  var vCancel = $("<button/>")
    .addClass("btn-cancel btn btn-danger")
    .text("Cancel");
  $("#add-modal .modal-footer").append(vCancel, vConfirmBtn);
  $("#add-modal #btn-save").remove();
}

function callApiCheckVoucherId() {
  $.ajax({
    url: gAPI_CHECK_VOUCHER_ID + gVoucherId,
    type: "GET",
    data: "json",
    async: false,
    success: function (res) {
      gDiscount = res.phanTramGiamGia;
    },
    error: function (err) {
      gDiscount = "0";
      console.log(err.responseText);
    },
  });
}

function callApiGetOrderByOrderID(paramOrderID) {
  $.ajax({
    url: gAPI_ALL_ORDERS + paramOrderID,
    type: "GET",
    data: "json",
    success: function (res) {
      //console.log(res);
      loadDataToModal(res);
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function callApiGetAllOrders() {
  $.ajax({
    url: gAPI_ALL_ORDERS,
    type: "GET",
    data: "json",
    async: false,
    success: function (res) {
      gOrderObject.orders = res;
      loadDataToTable(res);
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}

function callApiGetDrinks() {
  $.ajax({
    url: gAPI_DRINKS,
    type: "GET",
    data: "json",
    success: function (res) {
      loadDataToSelect(res, "drink");
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}

function callApiCreateOrder(paramOrder) {
  $.ajax({
    url: gAPI_ALL_ORDERS,
    type: "POST",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(paramOrder),
    success: function (res) {
      //console.log(res);
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}

function callApiUpdateOrderStatus(paramStatus) {
  var vObjectRequest = {
    trangThai: "", //3 trang thai open, confirmed, cancel
  };
  if (paramStatus == "confirm") {
    vObjectRequest.trangThai = "confirmed";
  } else {
    vObjectRequest.trangThai = "cancel";
  }
  $.ajax({
    url: gAPI_ALL_ORDERS + gID,
    type: "PUT",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(vObjectRequest),
    async: false,
    success: function (res) {
      //console.log(res);
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}

function callApiDeleteOrder(paramID) {
  $.ajax({
    url: gAPI_ALL_ORDERS + paramID,
    type: "DELETE",
    data: "json",
    success: function (res) {
      //console.log(res);
    },
    error: function (err) {
      //console.log(err);
    },
  });
}

function resetModalData() {
  //status
  gFormMode = gFORM_MODE_NORMAL;
  $("#div-form-mod").html(gFormMode);

  //id
  gID = 0;
  gOrderID = 0;

  //modal input
  $("#select-combo").val("0").prop("disabled", false);
  onSelectComboChange("0");
  $(".select-pizza").eq(1).val("0").prop("disabled", false);
  $("#input-voucher").val("").prop("disabled", false);
  $("#select-drink").val("0").prop("disabled", false);
  $("#input-fullname").val("").prop("disabled", false);
  $("#input-email").val("").prop("disabled", false);
  $("#input-phone").val("").prop("disabled", false);
  $("#input-address").val("").prop("disabled", false);
  $("#input-message").val("").prop("disabled", false);
}
