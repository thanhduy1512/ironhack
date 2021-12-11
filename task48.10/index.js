/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */

var gFORM_MODE_NORMAL = "Normal";
var gFORM_MODE_INSERT = "Insert";
var gFORM_MODE_UPDATE = "Update";
var gFORM_MODE_DELETE = "Delete";

// biến toàn cục cho trạng thái của form: mặc định ban đầu là trạng thái Normal
var gFormMode = gFORM_MODE_NORMAL;

// Biến mảng hằng số chứa danh sách tên các thuộc tính
const gUSER_COLS = ["stt", "studentId", "subjectId", "grade", "examDate"];

// Biến mảng toàn cục định nghĩa chỉ số các cột tương ứng
const gUSER_STT_COL = 0;
const gUSER_STUDENT_COL = 1;
const gUSER_SUBJECT_COL = 2;
const gUSER_GRADE_COL = 3;
const gUSER_DATE_COL = 4;
const gUSER_ACTIONS_COL = 5;

// Biến toàn cục để hiển lưu STT
var gSTT = 1;

var gGradeID = 0;
var gStudentID = 0;

var gDataTable = $("#student-table").DataTable({
  columns: [
    { data: gUSER_COLS[gUSER_STT_COL] },
    {
      data: gUSER_COLS[gUSER_STUDENT_COL],
      render: function (data, type) {
        if (type === "display") {
          let bFullname = getFullNameById(data);
          return "<span>" + bFullname + "<span>";
        } else {
          return data;
        }
      },
    },
    {
      data: gUSER_COLS[gUSER_SUBJECT_COL],
      render: function (data, type) {
        if (type === "display") {
          let bSubjectName = getSubjectNameById(data);
          return "<span>" + bSubjectName + "<span>";
        } else {
          return data;
        }
      },
    },
    { data: gUSER_COLS[gUSER_GRADE_COL] },
    { data: gUSER_COLS[gUSER_DATE_COL] },
    { data: gUSER_COLS[gUSER_ACTIONS_COL] },
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
      targets: gUSER_ACTIONS_COL,
      defaultContent: `
      <img class="edit-student" src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-512.png" style="width: 20px;cursor:pointer;">
      <img class="delete-student" src="https://cdn4.iconfinder.com/data/icons/complete-common-version-6-4/1024/trash-512.png" style="width: 20px;cursor:pointer;">
    `,
    },
  ],
});

/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */

$(document).ready(function () {
  onPageLoading();

  $("#btn-filter").on("click", function () {
    onBtnFilterClick();
  });

  $("#btn-add-new").on("click", function () {
    onBtnAddNewClick();
  });

  $("#btn-save-user").on("click", function () {
    onBtnSaveClick();
  });

  $("#student-table").on("click", ".edit-student", function () {
    onBtnEditUserClick(this);
  });

  $("#student-table").on("click", ".delete-student", function () {
    onBtnDeleteClick(this);
  });

  $("#btn-confirm-delete-user").on("click", function () {
    onBtnConfirmDeleteClick();
  });
  $("#btn-cancel").on("click", function () {
    resetModalData();
  });
});

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */

function onPageLoading() {
  loadDataToSelect(gStudentDB.students, "student");
  loadDataToSelect(gSubjects.subjects, "subject");

  loadDataToTable(gGrades.grades);
}

function onBtnFilterClick() {
  var vStudentID = $("#select-student").val();
  var vSubjectID = $(".select-subject").first().val();
  var vFilteredArr = gGrades.filterByID(vStudentID, vSubjectID);
  loadDataToTable(vFilteredArr);
}

function onBtnAddNewClick() {
  gFormMode = gFORM_MODE_INSERT;
  $("#div-form-mod").html(gFormMode);
  $("#add-edit-modal").modal("show");
}

function onBtnEditUserClick(paramIcon) {
  gFormMode = gFORM_MODE_UPDATE;
  $("#div-form-mod").html(gFormMode);
  gGradeID = getIdDataFromButton(paramIcon)[0];
  gStudentID = getIdDataFromButton(paramIcon)[1];
  showDataToModalUpdate(gGradeID);
  $("#add-edit-modal").modal("show");
}

function onBtnSaveClick() {
  //get data student
  var vStudent = {
    id:
      gFormMode == gFORM_MODE_INSERT
        ? gStudentDB.students[gStudentDB.students.length - 1].id + 1
        : gStudentID,
    studentCode: $("#input-student-code").val(),
    username: $("#input-username").val(),
    firstname: $("#input-firstname").val(),
    lastname: $("#input-lastname").val(),
    birthday: $("#input-birthday").val(),
    email: $("#input-email").val(),
    studyYear: parseInt($("#input-study-year").val()),
  };

  var vDate = vStudent.birthday.split("-");
  vStudent.birthday = vDate[2] + "/" + vDate[1] + "/" + vDate[0];

  //get data grade
  var vGrade = {
    id:
      gFormMode == gFORM_MODE_INSERT
        ? gGrades.grades[gGrades.grades.length - 1].id + 1
        : gGradeID,
    studentId: vStudent.id,
    subjectId: $(".select-subject").eq(1).val(),
    grade: parseFloat($("#input-grade").val()),
    examDate: $("#input-date").val(),
  };

  var vExamDate = vGrade.examDate.split("-");
  vGrade.examDate = vExamDate[2] + "/" + vExamDate[1] + "/" + vExamDate[0];

  //validate data
  var vIsValid = validateData(vStudent, vGrade);
  //process data
  if (vIsValid) {
    gStudentDB.saveStudent(vStudent);
    gGrades.saveGrade(vGrade);
    loadDataToSelect(gStudentDB.students, "student");
    loadDataToTable(gGrades.grades);
    $("#add-edit-modal").modal("hide");
    alert("Update Success!");
    resetModalData();
  }
}

function onBtnDeleteClick(paramIcon) {
  gFormMode = gFORM_MODE_DELETE;
  $("#div-form-mod").html(gFormMode);
  gGradeID = getIdDataFromButton(paramIcon)[0];
  gStudentID = getIdDataFromButton(paramIcon)[1];
  $("#delete-modal").modal("show");
}

function onBtnConfirmDeleteClick() {
  var vDataIndex = getIndexById(gGradeID, gGrades.grades);
  gGrades.deleteGrade(vDataIndex);
  loadDataToSelect(gStudentDB.students, "student");
  loadDataToTable(gGrades.grades);
  $("#delete-modal").modal("hide");
  alert("Data Deleted!");
  resetModalData();
}
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/

function validateData(paramStudent, paramGrade) {
  var vStudentIsValid = gStudentDB.validateData(paramStudent);
  if (vStudentIsValid) {
    var vGradeIsValid = gGrades.validateData(paramGrade);
  }
  if (!vStudentIsValid || !vGradeIsValid) {
    return false;
  }
  return true;
}

function loadDataToSelect(paramArr, paramCondition) {
  for (let i = 0; i <= paramArr.length - 1; i++) {
    if (paramCondition == "student") {
      var vSelect = $("#select-student");
      var vText = paramArr[i].firstname + " " + paramArr[i].lastname;
    } else if (paramCondition == "subject") {
      var vSelect = $(".select-subject");
      var vText = paramArr[i].subjectName;
    }

    let vOption = $("<option/>").val(paramArr[i].id).text(vText);
    vSelect.append(vOption);
  }
}

function loadDataToTable(paramUserArr) {
  gSTT = 1;
  gDataTable.clear();
  gDataTable.rows.add(paramUserArr);
  gDataTable.draw();
}

function getFullNameById(paramID) {
  var vStudent = gStudentDB.students.filter((student) => {
    return student.id == paramID;
  });
  var vFullname = vStudent[0].firstname + " " + vStudent[0].lastname;
  return vFullname;
}

function getSubjectNameById(paramID) {
  var vSubject = gSubjects.subjects.filter((subject) => {
    return subject.id == paramID;
  });
  var vSubjectName = vSubject[0].subjectName;
  return vSubjectName;
}

function getIdDataFromButton(paramIcon) {
  var vTableRow = $(paramIcon).parents("tr");
  var vUserRowData = gDataTable.row(vTableRow).data();
  return [vUserRowData.id, vUserRowData.studentId];
}

function showDataToModalUpdate(paramGradeID) {
  var vDataIndex = getIndexById(paramGradeID, gGrades.grades);
  //show student data to modal
  showStudentToModal(gStudentID);
  //show grade data to modal
  $(".select-subject").eq(1).val(gGrades.grades[vDataIndex].subjectId);
  $("#input-grade").val(gGrades.grades[vDataIndex].grade);
  let vDateString = gGrades.grades[vDataIndex].examDate.split("/");
  let vInputDate = vDateString[2] + "-" + vDateString[1] + "-" + vDateString[0];
  $("#input-date").val(vInputDate);
}

function getIndexById(paramID, paramArr) {
  for (let i = 0; i < paramArr.length; i++) {
    if (paramArr[i].id == paramID) {
      return i;
    }
  }
  return -1;
}

function showStudentToModal(paramStudentID) {
  var vDataIndex = getIndexById(paramStudentID, gStudentDB.students);
  $("#input-student-code").val(gStudentDB.students[vDataIndex].studentCode);
  $("#input-username").val(gStudentDB.students[vDataIndex].username);
  $("#input-firstname").val(gStudentDB.students[vDataIndex].firstname);
  $("#input-lastname").val(gStudentDB.students[vDataIndex].lastname);
  let vDateString = gStudentDB.students[vDataIndex].birthday.split("/");
  let vInputDate = vDateString[2] + "-" + vDateString[1] + "-" + vDateString[0];
  $("#input-birthday").val(vInputDate);
  $("#input-email").val(gStudentDB.students[vDataIndex].email);
  $("#input-study-year").val(gStudentDB.students[vDataIndex].studyYear);
}

function resetModalData() {
  //status
  gFormMode = gFORM_MODE_NORMAL;
  $("#div-form-mod").html(gFormMode);

  //id
  gGradeID = 0;
  gStudentID = 0;

  //modal input
  $("#input-username").val("");
  $("#input-student-code").val("");
  $("#input-firstname").val("");
  $("#input-lastname").val("");
  $("#input-email").val("");
  $("#input-birthday").val("");
  $("#input-study-year").val("");
  $(".select-subject").eq(1).val("0");
  $("#input-grade").val("");
  $("#input-date").val("");
}
