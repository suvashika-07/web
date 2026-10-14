var app = angular.module("courseApp", []);

app.controller("CourseController", function ($scope, $http) {
  var API = "/api/students";

  $scope.departments = ["CSE", "ECE", "IT", "EEE", "Mechanical", "Civil"];
  $scope.courses = ["DSA", "IoT", "Web Development", "Cloud Computing", "AI & ML"];
  $scope.years = [1, 2, 3, 4];

  $scope.students = [];
  $scope.form = {};
  $scope.editingId = null;
  $scope.message = "";
  $scope.loading = false;

  function showError(error, fallback) {
    $scope.message = (error && error.data && error.data.message) || fallback;
  }

  $scope.loadStudents = function () {
    $scope.loading = true;
    $http.get(API).then(function (response) {
      $scope.students = response.data;
    }).catch(function (error) {
      showError(error, "Could not load records. Check the server and MongoDB connection.");
    }).finally(function () {
      $scope.loading = false;
    });
  };

  $scope.saveStudent = function () {
    if (!$scope.form.name || !$scope.form.registerNo ||
        !$scope.form.department || !$scope.form.course || !$scope.form.year) {
      $scope.message = "Please complete all required fields.";
      return;
    }

    var payload = angular.copy($scope.form);
    $scope.loading = true;
    var request;

    if ($scope.editingId) {
      request = $http.put(API + "/" + $scope.editingId, payload);
    } else {
      request = $http.post(API, payload);
    }

    request.then(function (response) {
      $scope.message = $scope.editingId
        ? "Student details updated successfully."
        : "Student registered successfully.";
      $scope.form = {};
      $scope.editingId = null;
      return $scope.loadStudents();
    }).catch(function (error) {
      showError(error, "Could not save the record. Check your server and database.");
    }).finally(function () {
      $scope.loading = false;
    });
  };

  $scope.editStudent = function (student) {
    $scope.form = {
      name: student.name,
      registerNo: student.registerNo,
      department: student.department,
      course: student.course,
      year: student.year
    };
    $scope.editingId = student._id;
    $scope.message = "Edit the details above, then click Update.";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  $scope.deleteStudent = function (student) {
    if (!window.confirm("Delete this student record?")) return;

    $http.delete(API + "/" + student._id).then(function () {
      $scope.message = "Student record deleted.";
      if ($scope.editingId === student._id) $scope.clearForm();
      return $scope.loadStudents();
    }).catch(function (error) {
      showError(error, "Could not delete the record.");
    });
  };

  $scope.clearForm = function () {
    $scope.form = {};
    $scope.editingId = null;
    $scope.message = "";
  };

  $scope.loadStudents();
});
