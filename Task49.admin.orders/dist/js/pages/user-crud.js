/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
/* Mảng userObjects là mảng chứa dữ liệu user. Từng phần tử là object
 * id: tự tăng lên 1. Ví dụ, hiện id lớn nhất là 6, thì khi thêm user mới, id sẽ là 7
 */
var gFORM_MODE_NORMAL = "Normal";
var gFORM_MODE_INSERT = "Insert";
var gFORM_MODE_UPDATE = "Update";
var gFORM_MODE_DELETE = "Delete";

// biến toàn cục cho trạng thái của form: mặc định ban đầu là trạng thái Normal
var gFormMode = gFORM_MODE_NORMAL;

// Biến toàn cục để lưu trữ id voucher đang đc update or delete. Mặc định = 0;
var gUserId = 0;

var gUserObjects = {
  users: [
    {
      id: 2,
      username: "quannv",
      firstname: "Ngo Van",
      lastname: "Quan",
      age: 18,
      email: "quan@gmail.com",
      roleId: 5,
    },
    {
      id: 3,
      username: "longdh",
      firstname: "Do Hoang",
      lastname: "Long",
      age: 19,
      email: "long@gmail.com",
      roleId: 8,
    },
    {
      id: 4,
      username: "hiendt",
      firstname: "Do Thi",
      lastname: "Hien",
      age: 29,
      email: "hien@gmail.com",
      roleId: 11,
    },
    {
      id: 6,
      username: "lanht",
      firstname: "Ho Thi",
      lastname: "Lan",
      age: 27,
      email: "lan@gmail.com",
      roleId: 13,
    },
  ],

  filterRole: function (paramRoleId) {
    var vUpdatedUserArr = this.users.filter((user) => {
      return user.roleId == paramRoleId || paramRoleId == 0;
    });
    return vUpdatedUserArr;
  },

  saveUser: function (paramUser) {
    if (gFormMode === gFORM_MODE_INSERT) {
      this.users.push(paramUser);
    } else {
      vUserIndex = getUserIndexById(gUserId);
      this.users.splice(vUserIndex, 1, paramUser);
    }
  },

  deleteUser: function (paramUserIndex) {
    this.users.splice(paramUserIndex, 1);
  },
};

// TODO: Điền tiếp các phần tử tiếp theo của mảng Role (xem trong slide task specification)
var gRoleObjects = [
  {
    roleId: 5,
    roleName: "Admin",
  },
  {
    roleId: 8,
    roleName: "Manager",
  },
  {
    roleId: 11,
    roleName: "Teacher",
  },
  {
    roleId: 13,
    roleName: "Staff",
  },
];

// Biến mảng hằng số chứa danh sách tên các thuộc tính
const gUSER_COLS = [
  "stt",
  "username",
  "firstname",
  "lastname",
  "age",
  "email",
  "roleId",
];

// Biến mảng toàn cục định nghĩa chỉ số các cột tương ứng
const gUSER_STT_COL = 0;
const gUSER_USERNAME_COL = 1;
const gUSER_FIRSTNAME_COL = 2;
const gUSER_LASTNAME_COL = 3;
const gUSER_AGE_COL = 4;
const gUSER_EMAIL_COL = 5;
const gUSER_ROLE_ID_COL = 6;
const gUSER_ACTION_COL = 7;

// Biến toàn cục để hiển lưu STT
var gSTT = 1;

var gUserTable = $("#user-table").DataTable({
  columns: [
    { data: gUSER_COLS[gUSER_STT_COL] },
    { data: gUSER_COLS[gUSER_USERNAME_COL] },
    { data: gUSER_COLS[gUSER_FIRSTNAME_COL] },
    { data: gUSER_COLS[gUSER_LASTNAME_COL] },
    { data: gUSER_COLS[gUSER_AGE_COL] },
    { data: gUSER_COLS[gUSER_EMAIL_COL] },
    {
      data: gUSER_COLS[gUSER_ROLE_ID_COL],
      render: function (data, type) {
        if (type === "display") {
          let bRoleName = getRoleNameByRoleId(data);
          return "<span>" + bRoleName + "<span>";
        } else {
          return data;
        }
      },
    },
    { data: gUSER_COLS[gUSER_ACTION_COL] },
  ],
  columnDefs: [
    {
      // định nghĩa lại cột STT
      targets: gUSER_STT_COL,
      render: function () {
        return gSTT++;
      },
    },
    {
      // định nghĩa lại cột action
      targets: gUSER_ACTION_COL,
      defaultContent: `
    <img class="edit-user" src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png" style="width: 20px;cursor:pointer;">
    <img class="delete-user" src="https://cdn4.iconfinder.com/data/icons/complete-common-version-6-4/1024/trash-512.png" style="width: 20px;cursor:pointer;">
  `,
    },
  ],
});
/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */
onPageLoading();

$("#btn-add-user").on("click", function () {
  onBtnAddUser();
});

$("#user-table").on("click", ".edit-user", function () {
  onBtnEditUser(this);
});

$("#btn-save-user").on("click", function () {
  onBtnSaveUser();
});

$("#btn-filter-data").on("click", function () {
  onBtnFilterClick();
});

$("#user-table").on("click", ".delete-user", function () {
  onBtnDeleteUser(this);
});

$("#btn-confirm-delete-user").on("click", function () {
  onBtnConfirmDeleteUser();
});

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
function onPageLoading() {
  loadRoleToSelectOption();
  loadDataToUserTable(gUserObjects.users);
  $("#div-form-mod").html(gFormMode);
}

function onBtnFilterClick() {
  var vRoleIdFilter = parseInt($("#filter-select").val());
  var vUpdatedUserArr = gUserObjects.filterRole(vRoleIdFilter);
  loadDataToUserTable(vUpdatedUserArr);
}

function onBtnAddUser() {
  // chuyển đổi trạng thái form về insert
  gFormMode = gFORM_MODE_INSERT;
  $("#div-form-mod").html(gFormMode);
  // hiển thị modal trắng lên
  $("#user-modal").modal("show");
}

function onBtnEditUser(paramIcon) {
  // chuyển đổi trạng thái form về insert
  gFormMode = gFORM_MODE_UPDATE;
  $("#div-form-mod").html(gFormMode);
  gUserId = getIdDataFromButton(paramIcon);
  showDataToModalUpdate(gUserId);
  // hiển thị modal trắng lên
  $("#user-modal").modal("show");
}

function onBtnDeleteUser(paramIcon) {
  // chuyển đổi trạng thái form về insert
  gFormMode = gFORM_MODE_DELETE;
  $("#div-form-mod").html(gFormMode);
  gUserId = getIdDataFromButton(paramIcon);
  // hiển thị modal trắng lên
  $("#delete-confirm-modal").modal("show");
}

function onBtnSaveUser() {
  var vUser = {
    id: 0,
    username: "",
    firstname: "",
    lastname: "",
    age: 0,
    email: "",
    roleId: 0,
  };

  getUserFromData(vUser);

  var vValidate = validateData(vUser);
  if (vValidate) {
    //process data
    gUserObjects.saveUser(vUser);
    //show data
    loadDataToUserTable(gUserObjects.users);
    //notice
    alert("Update Success!");
    $("#user-modal").modal("hide");
    //reset data
    resetUserData();
  }
}

function onBtnConfirmDeleteUser() {
  //get index then delete in array
  var vUserIndex = getUserIndexById(gUserId);
  gUserObjects.deleteUser(vUserIndex);
  //load table and notice
  loadDataToUserTable(gUserObjects.users);
  alert("Delete Success!");
  $("#delete-confirm-modal").modal("hide");

  //reset
  resetUserData();
}

function loadDataToUserTable(paramUserArr) {
  gSTT = 1;
  gUserTable.clear();
  gUserTable.rows.add(paramUserArr);
  gUserTable.draw();
}
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/

function getUserFromData(paramUser) {
  //id
  if (gFormMode == gFORM_MODE_INSERT) {
    paramUser.id = getNextId();
  } else {
    paramUser.id = gUserId;
  }
  //data
  paramUser.username = $("#input-username").val().trim();
  paramUser.firstname = $("#input-firstname").val();
  paramUser.lastname = $("#input-lastname").val();
  paramUser.age = parseInt($("#input-age").val());
  paramUser.email = $("#input-email").val();
  paramUser.roleId = $("#input-role").val();
}

function validateData(paramUser) {
  if (paramUser.username == "") {
    alert("Provide Username!");
    return false;
  }
  if (isDataExist("username", paramUser.username)) {
    alert("Username Already Exist!");
    return false;
  }
  if (paramUser.firstname.trim() == "") {
    alert("Provide Firstname!");
    return false;
  }
  if (paramUser.lastname.trim() == "") {
    alert("Provide Lastname!");
    return false;
  }
  if (paramUser.email.trim() == "") {
    alert("Provide Email!");
    return false;
  }
  if (!paramUser.email.includes("@") || !paramUser.email.includes(".")) {
    alert("Invalid Email!");
    return false;
  }
  if (isDataExist("email", paramUser.email)) {
    alert("Email Already Exist!");
    return false;
  }
  if (paramUser.roleId == "") {
    alert("Provide Role!");
    return false;
  }
  if (paramUser.age < 10 || paramUser.age > 180 || isNaN(paramUser.age)) {
    alert("Invalid Age!");
    return false;
  }
  return true;
}

function isDataExist(paramData, paramValue) {
  var vFound = false;
  var vIndex = 0;

  if (gFormMode == gFORM_MODE_INSERT) {
    while (!vFound && vIndex < gUserObjects.users.length) {
      if (gUserObjects.users[vIndex][paramData] == paramValue) {
        vFound = true;
      } else {
        vIndex++;
      }
    }
  } else {
    while (!vFound && vIndex < gUserObjects.users.length) {
      if (
        gUserObjects.users[vIndex][paramData] == paramValue &&
        gUserObjects.users[vIndex].id !== gUserId
      ) {
        vFound = true;
      } else {
        vIndex++;
      }
    }
  }
  return vFound;
}

function getRoleNameByRoleId(paramRoleId) {
  for (let role of gRoleObjects) {
    if (role.roleId === parseInt(paramRoleId)) {
      return role.roleName;
    }
  }
}

function loadRoleToSelectOption() {
  for (let i = 0; i < gRoleObjects.length; i++) {
    $("select").append(
      "<option value=" +
        gRoleObjects[i].roleId +
        ">" +
        gRoleObjects[i].roleName +
        "</option>"
    );
  }
}

function getIdDataFromButton(paramIcon) {
  var vTableRow = $(paramIcon).parents("tr");
  var vUserRowData = gUserTable.row(vTableRow).data();
  return vUserRowData.id;
}

function getUserIndexById(paramUserId) {
  var vUserIndex = -1;
  var vFound = false;
  var index = 0;
  while (!vFound && index < gUserObjects.users.length) {
    if (gUserObjects.users[index].id == paramUserId) {
      vUserIndex = index;
      vFound = true;
    } else {
      index++;
    }
  }
  return vUserIndex;
}

function showDataToModalUpdate(paramUserId) {
  var vUserIndex = getUserIndexById(paramUserId);
  $("#input-username").val(gUserObjects.users[vUserIndex].username);
  $("#input-firstname").val(gUserObjects.users[vUserIndex].firstname);
  $("#input-lastname").val(gUserObjects.users[vUserIndex].lastname);
  $("#input-email").val(gUserObjects.users[vUserIndex].email);
  $("#input-age").val(gUserObjects.users[vUserIndex].age);
  $("#input-role").val(gUserObjects.users[vUserIndex].roleId);
}

function getNextId() {
  var vNextId = 0;
  // nếu mảng chưa có phần tử nào, thì id sẽ bắt đầu từ 1
  if (gUserObjects.users.length == 0) {
    vNextId = 1;
  } else {
    // id tiếp theo bằng id của phần tử cuối cùng cộng thêm 1
    vNextId = gUserObjects.users[gUserObjects.users.length - 1].id + 1;
  }
  return vNextId;
}

function resetUserData() {
  //status
  gFormMode = gFORM_MODE_NORMAL;
  $("#div-form-mod").html(gFormMode);

  //id
  gUserId = 0;

  //modal input
  $("#input-username").val("");
  $("#input-firstname").val("");
  $("#input-lastname").val("");
  $("#input-age").val("");
  $("#input-email").val("");
  $("#input-role").val("");
}
