const ROWS = 9;
const COLUMNS = 5;

var teachers = {}
var courses = {}
var students = {}
var absenceData = {}

function constructTeacherTable(teacher, dict, emptyValue) {
    if (dict[teacher.uid] != undefined) {
        return;
    }

    dict[teacher.uid] = dict[teacher.uid] || [];
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLUMNS; j++) {
            row.push(emptyValue);
        }
        dict[teacher.uid].push(row);
    }
}

function addAbsence(teacher, day, periodStart, periodEnd) {
    if (absenceData[teacher.uid] == undefined) {
        constructTeacherTable(teacher, absenceData, false);
    }
    for (var period = periodStart; period <= periodEnd; period++) {
        absenceData[teacher.uid][period][day] = true;
    }
}

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

        var teacher = teachers[11052283];
        var startingPeriod = Math.random() * 9
        addAbsence(teacher, 1, 2, 8);

        generateSchedule(teacher);
    }
}

// Generate a table of the teacher's schedule
function generateSchedule(teacher) {
    console.log(teacher);

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
            if (absenceData[teacher.uid][i][j]) {
                td.style.backgroundColor = "red";
            }
        }
    }
    body.appendChild(tbl);
}

document.addEventListener("DOMContentLoaded", function() {
    loadData();
});
