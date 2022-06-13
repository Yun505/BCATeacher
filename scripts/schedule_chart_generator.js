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

        generateSchedule(teachers[11052283]);
    }
}

// Generate a table of the teacher's schedule
function generateSchedule(teacher) {
    console.log(teacher);
    const ROWS = 9;
    const COLUMNS = 5;

    // Construct a 2D array of the teacher's courses
    var schedule = []
    for (let i = 0; i < ROWS; i++) {
        var row = [];
        for (let j = 0; j < COLUMNS; j++) {
            row.push("__________");
        }
        schedule.push(row);
    }

    // Fill the 2D array
    teacher.courses.forEach(cid => {
        var course = courses[cid]
        if (course == undefined) {
            console.log("Unable to find course ID <" + cid + ">");
        } else {
            var row = schedule[course.period-1];
            for (let i = 0; i < COLUMNS; i++) {
                if (course.days[i]) {
                    console.log(i, row);
                    console.log(course);
                    console.log(course.period);
                    console.log(row[i]);
                    row[i] = course.name;
                }
            }
        }
    })

    const body = document.body;
    const tbl = document.createElement('table');

    tbl.style.width = '100px';
    tbl.style.border = '1px solid black';
    
    // Create the table itself
    for (let i = 0; i < ROWS; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < COLUMNS; j++) {
            const td = tr.insertCell();
            var text = schedule[i][j];
            td.appendChild(document.createTextNode(text));
            td.style.border = '1px solid black';
        }
    }
    body.appendChild(tbl);
}

document.addEventListener("DOMContentLoaded", function() {
    loadData();
});
