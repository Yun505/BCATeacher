var teachers = {}
var courses = {}
var students = {}

function loadData() {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", transferComplete);
    oReq.open("GET", "http://localhost:3000/getData");
    oReq.send();

    function transferComplete(evt) {
        console.log("Transfer complete.");
        console.log(evt);

        // Get all of the courses from the server
        var allCourses = []
        allCourses = JSON.parse(evt.target.responseText);
        console.log(allCourses);

        allCourses.courses.forEach(course => {
            courses[course.cid] = course;

            // Add all the teachers
            for (var i = 0; i < course.teachers.length; i++) {
                var teacher = course.teachers[i];
                if (teachers[teacher.uid] == null) {
                    teachers[teacher.uid] = teacher;
                }
                course.teachers[i] = teachers[teacher.uid];
            }

            // Add all the students
            for (var i = 0; i < course.students.length; i++) {
                var student = course.students[i];
                if (students[student.uid] == null) {
                    students[student.uid] = student;
                }
                course.students[i] = students[student.uid];
            }
        })

        console.log(teachers);
        console.log(courses);
        console.log(students);

        generateList();

        const Filter = document.getElementById('filter');
        Filter.addEventListener('change', updateValue);
        function updateValue(e) {
            generateList(Filter);
        }
    }
}

// Generate a table of people
function generateList(Filter) {
    var teacherKeys = Object.keys(teachers);
    var displayList = [];
    if (Filter == undefined){
        for (var i = 0; i < teacherKeys.length; i ++){
            displayList.push(teacher);
        }
    }
    else{
        for (var i = 0; i < teacherKeys.length; i++ ){
            var teacher = teachers[teacherKeys[i]];
            if ((teacher.name).includes(Filter.value)){
                displayList.push(teacher);
            }
        }
    }
    const body = document.body;
    const tbl = document.createElement('table');

    
    // Create the table itself
    for (let j = 0; j < displayList.length; j++) {
        var text = displayList[j].name;
        td.appendChild(document.createTextNode(text));
    }
    
    body.appendChild(tbl);
}

document.addEventListener("DOMContentLoaded", function() {
    loadData();
});
