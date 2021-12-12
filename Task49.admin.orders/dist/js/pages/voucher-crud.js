"use strict";
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */

/** Các biến toàn cục hằng số Form mode: 4 trạng thái của form. Mặc định sẽ là Normal
 *
 ** Khi ấn vào nút Thêm, cần đổi biến trạng thái về trạng thái Insert
 ** Khi ấn vào nút Sửa, cần đổi biến trạng thái về trạng thái Update
 ** Khi ấn vào nút Xóa, cần đổi biến trạng thái về trạng thái Delete
 *
 * Tại một thời điểm, trạng thái của form luôn là 1 trong 4 trạng thái
 */
var gFORM_MODE_NORMAL = "Normal";
var gFORM_MODE_INSERT = "Insert";
var gFORM_MODE_UPDATE = "Update";
var gFORM_MODE_DELETE = "Delete";

// biến toàn cục cho trạng thái của form: mặc định ban đầu là trạng thái Normal
var gFormMode = gFORM_MODE_NORMAL;

// Biến toàn cục để lưu trữ id voucher đang đc update or delete. Mặc định = 0;
var gVoucherId = 0;

// mảng chứa dữ liệu vouchers
var gVoucherObjects = [
  {
    id: 10,
    voucherCode: "12456",
    discount: 20,
  },
  {
    id: 13,
    voucherCode: "15678",
    discount: 10,
  },
  {
    id: 14,
    voucherCode: "34215",
    discount: 15,
  },
  {
    id: 16,
    voucherCode: "12785",
    discount: 15,
  },
  {
    id: 17,
    voucherCode: "13785",
    discount: 10,
  },
  {
    id: 18,
    voucherCode: "10385",
    discount: 20,
  },
];

// Biến mảng hằng số chứa danh sách tên các thuộc tính
const gVOUCHER_COLS = ["stt", "id", "voucherCode", "discount", "action"];

// Biến mảng toàn cục định nghĩa chỉ số các cột tương ứng
const gVOUCHER_STT_COL = 0;
const gVOUCHER_ID_COL = 1;
const gVOUCHER_VOUCHER_CODE_COL = 2;
const gVOUCHER_DISCOUNT_COL = 3;
const gVOUCHER_ACTION_COL = 4;

// Biến toàn cục để hiển lưu STT
var gSTT = 1;
// Khai báo DataTable & mapping collumns
var gVoucherTable = $("#voucher-table").DataTable({
  columns: [
    { data: gVOUCHER_COLS[gVOUCHER_STT_COL] },
    { data: gVOUCHER_COLS[gVOUCHER_ID_COL] },
    { data: gVOUCHER_COLS[gVOUCHER_VOUCHER_CODE_COL] },
    { data: gVOUCHER_COLS[gVOUCHER_DISCOUNT_COL] },
    { data: gVOUCHER_COLS[gVOUCHER_ACTION_COL] },
  ],
  columnDefs: [
    {
      // định nghĩa lại cột STT
      targets: gVOUCHER_STT_COL,
      render: function () {
        return gSTT++;
      },
    },
    {
      // định nghĩa lại cột action
      targets: gVOUCHER_ACTION_COL,
      defaultContent: `
          <img class="edit-voucher" src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png" style="width: 20px;cursor:pointer;">
          <img class="delete-voucher" src="https://cdn4.iconfinder.com/data/icons/complete-common-version-6-4/1024/trash-512.png" style="width: 20px;cursor:pointer;">
        `,
    },
  ],
});

/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */
onPageLoading();

// 2 - C: gán sự kiện Create - Thêm mới voucher
$("#btn-add-voucher").on("click", function () {
  onBtnAddNewVoucherClick();
});
// 3 - U: gán sự kiện Update - Sửa 1 voucher
$("#voucher-table").on("click", ".edit-voucher", function () {
  onIconEditVoucherClick(this);
});

// 4 - D: gán sự kiện Delete - Delete 1 voucher
$("#voucher-table").on("click", ".delete-voucher", function () {
  onIconDeleteVoucherClick(this);
});

//thêm sự kiện cho nút save voucher
$("#btn-save-voucher").on("click", function () {
  onBtnSaveVoucherClick();
});

//thêm sự kiện cho nút delete confirm
$("#btn-confirm-delete-voucher").on("click", function () {
  onBtnDeleteVoucherClick();
});

//reset du lieu click cancel
$("#voucher-modal").on("hidden.bs.modal", function () {
  resetVoucherData();
});
$("#delete-confirm-modal").on("hidden.bs.modal", function () {
  resetVoucherData();
});
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
// hàm thực thi khi trang được load
function onPageLoading() {
  // 1 - R: Read / Load voucher to DataTable
  loadDataToVoucherTable(gVoucherObjects);
  // hiển thị formMode
  $("#div-form-mod").html(gFormMode);
}

// Hàm xử lý sự kiện khi nút Thêm mới đc click
function onBtnAddNewVoucherClick() {
  // chuyển đổi trạng thái form về insert
  gFormMode = gFORM_MODE_INSERT;
  $("#div-form-mod").html(gFormMode);
  // hiển thị modal trắng lên
  $("#voucher-modal").modal("show");
}

// Hàm xử lý sự kiện khi icon edit voucher trên bảng đc click
function onIconEditVoucherClick(paramIconEdit) {
  // chuyển đổi trạng thái form về update
  gFormMode = gFORM_MODE_UPDATE;
  $("#div-form-mod").html(gFormMode);
  // lưu thông tin voucherId đang được edit vào biến toàn cục
  gVoucherId = getIdDataFromButton(paramIconEdit);
  // load dữ liệu vào các trường dữ liệu trong modal
  showVoucherDataToModal(gVoucherId);
  // hiển thị modal lên
  $("#voucher-modal").modal("show");
}

// Hàm xử lý sự kiện khi icon delete voucher trên bảng đc click
function onIconDeleteVoucherClick(paramIconDelete) {
  // chuyển đổi trạng thái form về update
  gFormMode = gFORM_MODE_DELETE;
  $("#div-form-mod").html(gFormMode);
  // lưu thông tin voucherId đang được delete vào biến toàn cục
  gVoucherId = getIdDataFromButton(paramIconDelete);

  // hiển thị modal lên
  $("#delete-confirm-modal").modal("show");
}

/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
/** load voucher array to DataTable
 * in: voucher array
 * out: voucher table has data
 */
function loadDataToVoucherTable(paramVoucherArr) {
  gSTT = 1;
  gVoucherTable.clear();
  gVoucherTable.rows.add(paramVoucherArr);
  gVoucherTable.draw();
}

//hàm xử lí sự kiện save voucher
function onBtnSaveVoucherClick() {
  var vVoucher = {
    id: 0,
    voucherCode: "",
    discount: -1,
  };

  getVoucherFromData(vVoucher);

  var vValidate = validateData(vVoucher);
  if (vValidate) {
    //process data
    saveVoucherData(vVoucher);
    //show data
    loadDataToVoucherTable(gVoucherObjects);
    //notice
    alert("Update Success!");
    $("#voucher-modal").modal("hide");
    //reset data
    resetVoucherData();
  }
}
//hàm xử lí sự kiện delete voucher
function onBtnDeleteVoucherClick() {
  //process data
  deleteVoucherData();
  //show data
  loadDataToVoucherTable(gVoucherObjects);
  //notice
  alert("Delete Success!");
  $("#delete-confirm-modal").modal("hide");
  //reset data
  resetVoucherData();
}

function getVoucherFromData(paramVoucherObj) {
  //id
  if (gFormMode == gFORM_MODE_INSERT) {
    paramVoucherObj.id = getNextId();
  } else {
    paramVoucherObj.id = gVoucherId;
  }
  //id voucher code
  paramVoucherObj.voucherCode = $("#input-voucher-code").val().trim();

  //discount
  paramVoucherObj.discount = parseInt($("#input-discount").val().trim());
}

// hàm validate data
function validateData(paramVoucherObj) {
  if (paramVoucherObj.voucherCode === "") {
    alert("Voucher code cần nhập");
    return false;
  }
  if (paramVoucherObj.discount === 0 || isNaN(paramVoucherObj.discount)) {
    alert("Discount cần nhập");
    return false;
  }
  if (paramVoucherObj.discount < 0 || paramVoucherObj.discount > 100) {
    alert("Invalid Discount Percent");
    return false;
  }
  if (isExistVoucherCode(paramVoucherObj.voucherCode)) {
    alert("Mã Voucher bị trùng");
    return false;
  }

  return true;
}

function isExistVoucherCode(paramVoucherCode) {
  var vFound = false;
  var vIndex = 0;
  if (gFormMode === gFORM_MODE_INSERT) {
    while (!vFound && vIndex < gVoucherObjects.length) {
      if (gVoucherObjects[vIndex].voucherCode === paramVoucherCode) {
        vFound = true;
      } else {
        vIndex++;
      }
    }
  } else {
    while (!vFound && vIndex < gVoucherObjects.length) {
      if (
        gVoucherObjects[vIndex].voucherCode === paramVoucherCode &&
        gVoucherObjects[vIndex].id != gVoucherId
      ) {
        vFound = true;
      } else {
        vIndex++;
      }
    }
  }
  return vFound;
}

function saveVoucherData(paramVoucherObj) {
  if (gFormMode === gFORM_MODE_INSERT) {
    gVoucherObjects.push(paramVoucherObj);
  } else {
    var vVoucherIndex = getIndexFormVoucherId(paramVoucherObj.id);
    //cach 1
    // gVoucherObjects[vVoucherIndex].id = paramVoucherObj.id;
    // gVoucherObjects[vVoucherIndex].voucherCode =
    //   paramVoucherObj.voucherCode;
    // gVoucherObjects[vVoucherIndex].discount = paramVoucherObj.discount;

    //cach 2
    gVoucherObjects.splice(vVoucherIndex, 1, paramVoucherObj);
  }
}

function deleteVoucherData() {
  var vVoucherIndex = getIndexFormVoucherId(gVoucherId);
  gVoucherObjects.splice(vVoucherIndex, 1);
}
// get voucher index from voucher id
// input: paramVoucherId là voucherId cần tìm index
// output: trả về chỉ số (index) trong mảng voucher
function getIndexFormVoucherId(paramVoucherId) {
  var vVoucherIndex = -1;
  var vVoucherFound = false;
  var vLoopIndex = 0;
  while (!vVoucherFound && vLoopIndex < gVoucherObjects.length) {
    if (gVoucherObjects[vLoopIndex].id === paramVoucherId) {
      vVoucherIndex = vLoopIndex;
      vVoucherFound = true;
    } else {
      vLoopIndex++;
    }
  }
  return vVoucherIndex;
}

// hàm lấy ra đc id voucher tiếp theo, dùng khi thêm mới voucher
function getNextId() {
  var vNextId = 0;
  // nếu mảng chưa có phần tử nào, thì id sẽ bắt đầu từ 1
  if (gVoucherObjects.length == 0) {
    vNextId = 1;
  } else {
    // id tiếp theo bằng id của phần tử cuối cùng cộng thêm 1
    vNextId = gVoucherObjects[gVoucherObjects.length - 1].id + 1;
  }
  return vNextId;
}

// hàm dựa vào button detail (edit or delete) xác định đc id voucher
function getIdDataFromButton(paramIcon) {
  var vTableRow = $(paramIcon).parents("tr");
  var vVoucherRowData = gVoucherTable.row(vTableRow).data();
  return vVoucherRowData.id;
}

// hàm show voucher obj lên modal
function showVoucherDataToModal(paramVoucherId) {
  var vVoucherIndex = getIndexFormVoucherId(paramVoucherId);
  $("#input-voucher-code").val(gVoucherObjects[vVoucherIndex].voucherCode);
  $("#input-discount").val(gVoucherObjects[vVoucherIndex].discount);
}

//reset data
function resetVoucherData() {
  //reset trang thai
  gFormMode = gFORM_MODE_NORMAL;
  $("#div-form-mod").html(gFormMode);

  //reset voucherId
  gVoucherId = 0;

  //reset modal form
  $("#input-voucher-code").val("");
  $("#input-discount").val("");
}
