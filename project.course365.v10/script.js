var gCoursesDB = {
  description: "This DB includes all courses in system",
  courses: [
    {
      id: 1,
      courseCode: "FE_WEB_ANGULAR_101",
      courseName: "How to easily create a website with Angular",
      price: 750,
      discountPrice: 600,
      duration: "3h 56m",
      level: "Beginner",
      coverImage: "images/courses/course-angular.jpg",
      teacherName: "Morris Mccoy",
      teacherPhoto: "images/teacher/morris_mccoy.jpg",
      isPopular: false,
      isTrending: true,
    },
    {
      id: 2,
      courseCode: "BE_WEB_PYTHON_301",
      courseName: "The Python Course: build web application",
      price: 1050,
      discountPrice: 900,
      duration: "4h 30m",
      level: "Advanced",
      coverImage: "images/courses/course-python.jpg",
      teacherName: "Claire Robertson",
      teacherPhoto: "images/teacher/claire_robertson.jpg",
      isPopular: false,
      isTrending: true,
    },
    {
      id: 5,
      courseCode: "FE_WEB_GRAPHQL_104",
      courseName: "GraphQL: introduction to graphQL for beginners",
      price: 850,
      discountPrice: 650,
      duration: "2h 15m",
      level: "Intermediate",
      coverImage: "images/courses/course-graphql.jpg",
      teacherName: "Ted Hawkins",
      teacherPhoto: "images/teacher/ted_hawkins.jpg",
      isPopular: true,
      isTrending: false,
    },
    {
      id: 6,
      courseCode: "FE_WEB_JS_210",
      courseName: "Getting Started with JavaScript",
      price: 550,
      discountPrice: 300,
      duration: "3h 34m",
      level: "Beginner",
      coverImage: "images/courses/course-javascript.jpg",
      teacherName: "Ted Hawkins",
      teacherPhoto: "images/teacher/ted_hawkins.jpg",
      isPopular: true,
      isTrending: true,
    },
    {
      id: 8,
      courseCode: "FE_WEB_CSS_111",
      courseName: "CSS: ultimate CSS course from beginner to advanced",
      price: 750,
      discountPrice: 600,
      duration: "3h 56m",
      level: "Beginner",
      coverImage: "images/courses/course-css.jpg",
      teacherName: "Juanita Bell",
      teacherPhoto: "images/teacher/juanita_bell.jpg",
      isPopular: true,
      isTrending: true,
    },
    {
      id: 14,
      courseCode: "FE_WEB_WORDPRESS_111",
      courseName: "Complete Wordpress themes & plugins",
      price: 1050,
      discountPrice: 900,
      duration: "4h 30m",
      level: "Advanced",
      coverImage: "images/courses/course-wordpress.jpg",
      teacherName: "Clevaio Simon",
      teacherPhoto: "images/teacher/clevaio_simon.jpg",
      isPopular: true,
      isTrending: false,
    },
  ],
  getPopular: function () {
    var vPopularCourses = [];
    vPopularCourses = this.courses.filter(function (course) {
      return course.isPopular == true;
    });
    return vPopularCourses;
  },
  getTrending: function () {
    var vTrendingCourses = [];
    vTrendingCourses = this.courses.filter(function (course) {
      return course.isTrending == true;
    });
    return vTrendingCourses;
  },
};

$(document).ready(function () {
  onPageLoading();
});

function onPageLoading() {
  var vPopularCourses = gCoursesDB.getPopular();
  var vTrendingCourses = gCoursesDB.getTrending();
  renderCourse(vPopularCourses, "popular");
  renderCourse(vTrendingCourses, "trending");
  console.log(vTrendingCourses);
}

function renderCourse(paramCourses, paramType) {
  for (let i = 0; i < paramCourses.length; i++) {
    var vMarkup = `
  <div class="col-sm-3">
  <div class="card">
    <img
      class="card-img-top"
      src="${paramCourses[i].coverImage}"
      alt="Card image cap"
    />
    <div class="card-body">
      <h6 class="card-title">${paramCourses[i].courseName}</h6>
      <p class="card-text">
        <i class="far fa-clock"></i>
        ${paramCourses[i].duration} ${paramCourses[i].level}
      </p>
      <b>$${paramCourses[i].discountPrice}</b>
      <s>$${paramCourses[i].price}</s>
    </div>
    <div class="card-footer">
      <div class="row">
        <img
          class="person-img col-3"
          src="${paramCourses[i].teacherPhoto}"
        />
        <span class="col-6">${paramCourses[i].teacherName}</span>
        <i class="col-3 far fa-bookmark btn"></i>
      </div>
    </div>
  </div>
</div>`;
    if (paramType == "popular") {
      $("#popular-course div.row:first").append(vMarkup);
    } else {
      $("#trending-course div.row:first").append(vMarkup);
    }
  }
}
