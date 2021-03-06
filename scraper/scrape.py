import time
import pickle
import jsonpickle
from student import Student
from teacher import Teacher
from course import Course
from bs4 import BeautifulSoup
import werkzeug
werkzeug.cached_property = werkzeug.utils.cached_property
from robobrowser import RoboBrowser

DELAY = 0.25
DELAY = 0.01

# Create a file named <password.txt> and put your password into it
# Make sure not to accidentally commit and push it to a repository!!
p_file = open("password.txt", "r")
password = p_file.read()
p_file.close()

# Create a file named <username.txt> and put your username into it
u_file = open("username.txt", "r")
username = u_file.read()
u_file.close()

br = RoboBrowser()
br.open("https://bca.schoology.com/login/ldap?destination=home&school=11897239")
form = br.get_form(id="s-user-login-form")
form['mail'] = username  # Username
form['pass'] = password  # Password
br.submit_form(form)

students = []
teachers = []
courses = []

def scrape_all(cutoff=-1):
    current_url = "https://bca.schoology.com/enrollments/edit/members/group/2233228305/ajax?ss=&p="
    page = 1
    soup = BeautifulSoup(br.session.get(
        current_url+str(page)).text, 'html.parser')
    i = 1
    while (len(soup.select("tbody")) > 0):
        for user in soup.select("tbody")[0].select("tr"):
            time.sleep(DELAY)
            cur_id = int(user.get("id"))
            if cur_id in Student.student_ids or cur_id in Teacher.teacher_ids:
                continue
            name = user.find("a").get("title")
            courses_html = br.session.get(
                "https://bca.schoology.com/user/"+str(cur_id)+"/courses/list").text
            user_html = br.session.get(
                "https://bca.schoology.com/user/"+str(cur_id)+"/info").text
            user_page = BeautifulSoup(user_html, 'html.parser')
            if len(user_page.select(".content-top-wrapper > p")) == 1:
                teacher = Teacher(cur_id, name, courses_html, courses)
                # print(teacher)
                teachers.append(teacher)
            else:
                student = Student(cur_id, name, courses_html,
                                  user_html, courses)
                # print(student)
                students.append(student)
            if cutoff > 0:
                if i >= cutoff:
                    break
                else:
                    i += 1
        if cutoff > 0 and i >= cutoff:
            break
        page += 1
        soup = BeautifulSoup(br.session.get(
            current_url+str(page)).text, 'html.parser')

def scrape_seniors(cutoff=-1):
    current_url = "https://bca.schoology.com/enrollments/edit/members/group/772763961/ajax?ss=&p="
    page = 1
    soup = BeautifulSoup(br.session.get(
        current_url+str(page)).text, 'html.parser')
    i = 1
    while (len(soup.select("tbody")) > 0):
        for user in soup.select("tbody")[0].select("tr"):
            time.sleep(DELAY)
            cur_id = int(user.get("id"))
            if cur_id in Student.student_ids or cur_id in Teacher.teacher_ids:
                continue
            name = user.find("a").get("title")
            courses_html = br.session.get(
                "https://bca.schoology.com/user/"+str(cur_id)+"/courses/list").text
            user_html = br.session.get(
                "https://bca.schoology.com/user/"+str(cur_id)+"/info").text
            user_page = BeautifulSoup(user_html, 'html.parser')
            if len(user_page.select(".content-top-wrapper > p")) == 1:
                teacher = Teacher(cur_id, name, courses_html, courses)
                # print(teacher)
                teachers.append(teacher)
            else:
                student = Student(cur_id, name, courses_html,
                                  user_html, courses, True)
                # print(student)
                students.append(student)
            if cutoff > 0:
                if i >= cutoff:
                    break
                else:
                    i += 1
        if cutoff > 0 and i >= cutoff:
            break
        page += 1
        soup = BeautifulSoup(br.session.get(
            current_url+str(page)).text, 'html.parser')

def scrape_faculty():
    """
    Gets all teacher user_ids, and courses they teach.
    """
    current_url = "https://bca.schoology.com/school/11897239/faculty?page="

    for page in range(0, 13):
        soup = BeautifulSoup(br.session.get(
            current_url+str(page)).text, 'html.parser')

        for teacher in soup.select(".faculty-name"):
            time.sleep(DELAY)
            tid = int(teacher.find("a").attrs['href'][6:])
            if tid in Teacher.teacher_ids:
                continue
            name = teacher.get_text()
            course_html = br.session.get(
                "https://bca.schoology.com/user/"+str(tid)+"/courses/list").text
            t = Teacher(tid, name, course_html, courses)
            teachers.append(t)

def search():
    start = time.time()
    scrape_faculty()
    print("Faculty scraped...")
    scrape_seniors()
    print("Seniors scraped...")
    scrape_all()
    print("All scraped...")

    f1 = open("students", "wb")
    pickle.dump(students, f1)
    f1.close()
    f2 = open("teachers", "wb")
    pickle.dump(teachers, f2)
    f2.close()
    f3 = open("courses", "wb")
    pickle.dump(courses, f3)
    f3.close()

    end = time.time()

    print(end-start)

def contained(words, text):
    for x in words:
        if x in text: return True
    return False

def validName(name):
    omit = [
        "Lunch", "Study Hall", "Senior Experience", "Projects", "IGS"
    ]
    for part in omit:
        if part in name:
            return False
    return True

def load_data():
    def print_text():
        ctxt = open("classes.txt", "w")

        for co in sorted(courses, key=lambda x: x.name):
            if validName(co.name):
                ctxt.write(co.name+"\n")
                ctxt.write("Teachers:\n")
                for t in co.teachers:
                    ctxt.write(t.name+"\n")
                ctxt.write("Students:\n")
                for s in co.students:
                    ctxt.write(s.name+"\n")
                ctxt.write("\n")

        ctxt.close()
        
    def print_jsonified_text():
        ctxt = open("classes.txt", "w")
        ctxt.write("{")
        ctxt.write('"courses": [')
        
        first = True

        for co in sorted(courses, key=lambda x: x.name):
            if validName(co.name):
                if not first:
                    ctxt.write(",\n")
                first = False
                co.update_days()
                ctxt.write(jsonpickle.encode(co))

        ctxt.write("]}")
        ctxt.close()
    
    def legit_course_count(std):
        i = 0
        for s in std.courses:
            c = None
            for ci in courses:
                if ci.cid == s: c = ci.name
            if not contained(["homeroom","lunch", "senior experience", "projects", "study hall"], c.lower()):
                i += 1
        return i

    students_file = open("students", "rb")
    students = pickle.load(students_file)
    students_file.close()

    teachers_file = open("teachers", "rb")
    teachers = pickle.load(teachers_file)
    teachers_file.close()

    courses_file = open("courses", "rb")
    courses = pickle.load(courses_file)
    courses_file.close()
    
    print_jsonified_text()

    # Compute number of students in each grade/dropped BCA
    # grade_count = [0, 0, 0, 0]
    # drop_count = [0, 0, 0, 0]

    # for s in students:
    #     if s.grade != None:
    #         if len(s.courses) > 0:
    #             grade_count[s.grade - 1] += 1
    #         elif len(s.courses) == 0:
    #             drop_count[s.grade - 1] += 1
    # print(grade_count)
    # print(drop_count)

    # Rank by number of current courses on Schoology
    # cutoff = 0

    # for s in sorted(students, key=legit_course_count, reverse=True):
    #     print(s.name,legit_course_count(s),s.grade)
    #     cutoff += 1
    #     if cutoff >= 261: break

    # Rank by length of name
    # for s in sorted(students, key=lambda x: len(x.name), reverse=True):
    #     print(s.name,s.grade)
    #     cutoff += 1
    #     if cutoff >= 261: break


    

def main():
    #search()
    load_data()

main()
