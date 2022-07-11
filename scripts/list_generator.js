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

        var tbl = undefined;

        tbl = generateList();

        const filter = document.getElementById('filter');
        filter.addEventListener('input', updateValue);
        function updateValue(e) {
            tbl.remove();
            tbl = generateList(filter);
        }
    }
}

// Generate a table of people
function generateList(filter) {
    var teacherKeys = Object.keys(teachers);
    var displayList = [];
    if (filter == undefined || filter.value == "") {
        for (var i = 0; i < teacherKeys.length; i ++) {
            var teacher = teachers[teacherKeys[i]];
            displayList.push(teacher);
        }
    } else {
        for (var i = 0; i < teacherKeys.length; i++ ) {
            var teacher = teachers[teacherKeys[i]];
            if ((teacher.name).toLowerCase().includes(filter.value.toLowerCase())){
                displayList.push(teacher);
                console.log(teacher);
            }
        }
    }
    const body = document.body;
    const tbl = document.createElement('table');

    
    // Create the table itself
    for (let j = 0; j < displayList.length; j++) {
        const tr = tbl.insertRow();
        var text = displayList[j].name;
        tr.appendChild(document.createTextNode(text));
    }
    
    body.appendChild(tbl);
    return tbl;
}

document.addEventListener("DOMContentLoaded", function() {
    loadData();
});
