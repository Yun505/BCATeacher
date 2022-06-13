dayLetterToNumber = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4
}
dayNumberToName = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
]

class Course:
    course_ids = []
    def __init__(self, cid, name):
        self.cid = cid
        Course.course_ids.append(cid)
        self.name = name
        self.teachers = []
        self.students = []
                    
    def update_days(self):
        # self.days = {
        #     "Monday": False,
        #     "Tuesday": False,
        #     "Wednesday": False,
        #     "Thursday": False,
        #     "Friday": False
        # }
        self.days = [
            False,
            False,
            False,
            False,
            False
        ]
        self.period = -1
        
        # Add the days that the course is active on
        # Get the part of the name that contains the active days
        if len(self.name.split("(")) < 2:
            return
        
        # 20th Century Amer History: 9(B,E)
        splitByParen = self.name.split("(") # ["20th Century Amer History: 9", "B,E)"]
        activeDays = splitByParen[len(splitByParen)-1].split(")")[0]
        pieces = list(activeDays)
        
        pieceWithPeriod = splitByParen[len(splitByParen)-2]
        activePeriod = pieceWithPeriod[-1]
        self.period = int(activePeriod)
        
        # Enter traversing whenever we see a -, so that A-C would traverse [A, B, C]
        traversing = False
        traversingStart = 0
        
        for i in range(len(pieces)):
            p = pieces[i]
            if p == "-":
                traversing = True
                traversingStart = dayLetterToNumber[pieces[i-1]]
            elif p != ",":
                num = dayLetterToNumber[p]
                if traversing:
                    traversing = False
                    for i in range(traversingStart, num+1):
                        self.days[i] = True
                else:
                    self.days[num] = True
    
    def add_student(self, uid):
        if uid not in self.students:
            self.students.append(uid)
    
    def add_teacher(self, uid):
        if uid not in self.teachers:
            self.teachers.append(uid)
    
    def __str__(self):
        return "Course Name: "+self.name+" | Teachers: " + str(self.teachers)+" | Students: "+str(self.students)