/********************************
 INITIAL DATA SETUP
*********************************/
let data = JSON.parse(localStorage.getItem("assignments"));

if (!data) {
    data = [];
    for (let i = 1; i <= 90; i++) {
        data.push({
            roll: "25000" + String(i).padStart(5, "0"), // ✅ 10-digit roll number
            password: "student123",
            fileName: "",
            fileType: "",
            marks: "",
            feedback: ""
        });
    }
    localStorage.setItem("assignments", JSON.stringify(data));
}

/********************************
 STUDENT SUBMISSION
*********************************/
function submitAssignment() {
    let roll = document.getElementById("name").value.trim();
    let fileInput = document.getElementById("file");

    if (!roll || fileInput.files.length === 0) {
        alert("Enter Roll Number and Upload File");
        return;
    }

    let student = data.find(s => s.roll === roll);
    if (!student) {
        alert("Invalid Roll Number");
        return;
    }

    let file = fileInput.files[0];
    student.fileName = file.name;
    student.fileType = file.type;

    sessionStorage.setItem("loggedStudentRoll", roll);
    localStorage.setItem("assignments", JSON.stringify(data));

    alert("Assignment submitted successfully");
}

/********************************
 STUDENT LOGIN (VIEW PAGE)
*********************************/
function studentLogin() {
    let roll = document.getElementById("loginId").value.trim();
    let pass = document.getElementById("loginPass").value;
    let result = document.getElementById("result");

    let student = data.find(s => s.roll === roll && s.password === pass);

    if (!student) {
        result.innerHTML = "<p style='color:red'>Invalid Roll Number or Password</p>";
        return;
    }

    sessionStorage.setItem("loggedStudentRoll", roll);
    loadStudentView();
}

/********************************
 STUDENT VIEW (AUTO LOAD)
*********************************/
function loadStudentView() {
    let box = document.getElementById("result");
    if (!box) return;

    let roll = sessionStorage.getItem("loggedStudentRoll");
    if (!roll) {
        box.innerHTML = "<p>Please login first.</p>";
        return;
    }

    let student = data.find(s => s.roll === roll);
    if (!student) return;

    let submissionStatus = student.fileName ? "Submitted ✅" : "Not Submitted ❌";
    let marksText = student.marks !== "" ? student.marks + " / 25" : "Not graded";
    let feedbackText = student.feedback !== "" ? student.feedback : "Pending";

    box.innerHTML = `
        <p><b>Roll Number:</b> ${student.roll}</p>
        <p><b>Submission:</b> ${submissionStatus}</p>
        <p><b>File:</b> ${student.fileName || "—"}</p>
        <p><b>Marks:</b> ${marksText}</p>
        <p><b>Feedback:</b> ${feedbackText}</p>
    `;
}

/********************************
 TEACHER GRADING (SELECT DROPDOWN)
*********************************/
function loadTeacherDropdown() {
    let select = document.getElementById("studentSelect");
    if (!select) return;

    select.innerHTML = `<option value="">-- Select Student --</option>`;

    data.forEach((student, index) => {
        let status = student.fileName
            ? "✔ Submitted"
            : "⏳ Not Submitted";

        let option = document.createElement("option");
        option.value = index;

        // ✅ ONLY 10-digit roll number shown
option.textContent = `${student.roll ? student.roll : "25000" + String(index + 1).padStart(5, "0")} (⏳ Not Submitted)`;

        select.appendChild(option);
    });
}

function showSelectedStudent() {
    let index = document.getElementById("studentSelect").value;
    let box = document.getElementById("submissionBox");

    if (index === "") {
        box.innerHTML = "<p>Select a student to view submission</p>";
        return;
    }

    let s = data[index];

    // ✅ ALWAYS generate roll if missing
    let rollNumber = s.roll
        ? s.roll
        : "25000" + String(index + 1).padStart(5, "0");

    box.innerHTML = `
        <div class="grade-card">
            <p><strong>Roll Number:</strong> ${rollNumber}</p>
            <p><strong>Submission:</strong> 
                ${s.fileName ? "Submitted ✅" : "Not Submitted ❌"}
            </p>
            <p><strong>File:</strong> ${s.fileName || "—"}</p>

            <label>Marks (out of 25)</label>
            <input type="number" min="0" max="25"
                   id="marks"
                   value="${s.marks !== "" ? s.marks : ""}">

            <label>Feedback</label>
            <textarea id="feedback"
                      placeholder="Enter feedback here...">
${s.feedback !== "" ? s.feedback : ""}
            </textarea>

            <button onclick="saveGradeDropdown(${index})">
                Save Grade
            </button>
        </div>
    `;
}

function saveGradeDropdown(index) {
    let marks = document.getElementById("marks").value;
    let feedback = document.getElementById("feedback").value.trim();

    if (marks === "" || marks < 0 || marks > 25) {
        alert("Marks must be between 0 and 25");
        return;
    }

    data[index].marks = marks;
    data[index].feedback = feedback;

    localStorage.setItem("assignments", JSON.stringify(data));
    alert("Grade saved successfully");

    loadTeacherDropdown();
}

/********************************
 AUTO LOAD
*********************************/
document.addEventListener("DOMContentLoaded", () => {
    loadTeacherDropdown();
    loadStudentView();
});
