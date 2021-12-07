$(document).ready(function () {
  /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
  const gAPI_ALL_ORDERS = "http://42.115.221.44:8080/devcamp-pizza365/orders/";

  var gID = 0;

  var gObjectOrders = {
    ordersList: [],
    filterByStatus: function (paramFilterValue) {
      var vFilteredOrders = this.ordersList.filter(function (order) {
        return order.trangThai.includes(paramFilterValue);
      });
      return vFilteredOrders;
    },
  };

  var gColumnName = [
    "orderId",
    "kichCo",
    "loaiPizza",
    "idLoaiNuocUong",
    "thanhTien",
    "hoTen",
    "soDienThoai",
    "trangThai",
    "detail",
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
  /*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
  onPageLoading();

  $("#btn-filter").on("click", function () {
    onBtnFilterClick();
  });

  $("#order-table").on("click", ".btn-detail", function () {
    onBtnDetailClick(this);
  });

  $("#btn-confirm").on("click", function () {
    onBtnUpdateOrder("confirm");
  });

  $("#btn-cancel").on("click", function () {
    onBtnUpdateOrder("cancel");
  });
  /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */

  function onPageLoading() {
    callApiGetAllOrders();
  }
  /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình */
  function callApiGetAllOrders() {
    $.ajax({
      url: gAPI_ALL_ORDERS,
      type: "GET",
      dataType: "json",
      success: function (res) {
        gObjectOrders.ordersList = res;
        loadDataToTable(gObjectOrders.ordersList);
      },
      error: function (err) {
        console.log(err.responseText);
      },
    });
  }

  function loadDataToTable(paramArr) {
    gOrderTable.clear();
    gOrderTable.rows.add(paramArr);
    gOrderTable.draw();
  }

  function onBtnFilterClick() {
    var vFilterValue = $("#select-filter").val();
    var vFilteredOrders = gObjectOrders.filterByStatus(vFilterValue);
    loadDataToTable(vFilteredOrders);
  }

  function onBtnDetailClick(paramElement) {
    var vSelectedRow = $(paramElement).parents("tr");
    var vRowData = gOrderTable.row(vSelectedRow).data();
    var vOrderID = vRowData.orderId;
    gID = vRowData.id;

    $.ajax({
      url: gAPI_ALL_ORDERS + vOrderID,
      type: "GET",
      dataType: "json",
      success: function (res) {
        loadDataToModal(res);
        $("#detail-modal").modal("show");
      },
      error: function (err) {
        console.log(err);
      },
    });
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
      url: gAPI_ALL_ORDERS + gID,
      type: "PUT",
      data: JSON.stringify(vObjectRequest),
      contentType: "application/json;charset=UTF-8",
      success: function (res) {
        console.log(res);
        alert("Update Success");
        onPageLoading();
        $("#detail-modal").modal("hide");
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
});
