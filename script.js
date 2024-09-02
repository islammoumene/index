document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const studentTable = document
    .getElementById("studentTable")
    .getElementsByTagName("tbody")[0];
  const downloadAllBtn = document.getElementById("downloadAllBtn");
  let students = [];

  // Calculate age based on date of birth
  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  // Add student to the table
  function addStudentToTable(student) {
    const row = studentTable.insertRow();
    row.insertCell(0).innerText = student.name;
    row.insertCell(1).innerText = student.surname;
    row.insertCell(2).innerText = student.dob;
    row.insertCell(3).innerText = calculateAge(student.dob);
    row.insertCell(4).innerText = student.department;
    row.insertCell(5).innerText = student.placeOfBirth;
    row.insertCell(6).innerText = student.rate.toFixed(2);
    row.insertCell(7).innerText = student.note;

    // Create an edit button
    const editCell = row.insertCell(8);
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = () => editStudent(row);
    editCell.appendChild(editButton);

    // Create a print button
    const printCell = row.insertCell(9);
    const printButton = document.createElement("button");
    printButton.innerText = "Print to PDF";
    printButton.onclick = () => printStudentToPDF(student);
    printCell.appendChild(printButton);
  }

  // Edit student data
  function editStudent(row) {
    const cells = row.getElementsByTagName("td");
    const student = {
      name: cells[0].innerText,
      surname: cells[1].innerText,
      dob: cells[2].innerText,
      department: cells[4].innerText,
      placeOfBirth: cells[5].innerText,
      rate: parseFloat(cells[6].innerText),
      note: cells[7].innerText
    };

    // Fill the form with current student data
    document.getElementById("name").value = student.name;
    document.getElementById("surname").value = student.surname;
    document.getElementById("dob").value = student.dob;
    document.getElementById("department").value = student.department;
    document.getElementById("placeOfBirth").value = student.placeOfBirth;
    document.getElementById("rate").value = student.rate;
    document.getElementById("note").value = student.note;

    // Change form submit behavior to update student instead of adding
    studentForm.removeEventListener("submit", addStudent);
    studentForm.addEventListener("submit", function updateStudent(event) {
      event.preventDefault();
      // Update student object with new data
      student.name = document.getElementById("name").value.trim();
      student.surname = document.getElementById("surname").value.trim();
      student.dob = document.getElementById("dob").value;
      student.department = document.getElementById("department").value.trim();
      student.placeOfBirth = document
        .getElementById("placeOfBirth")
        .value.trim();
      student.rate = parseFloat(document.getElementById("rate").value);
      student.note = document.getElementById("note").value.trim();

      // Update table row with new student data
      cells[0].innerText = student.name;
      cells[1].innerText = student.surname;
      cells[2].innerText = student.dob;
      cells[3].innerText = calculateAge(student.dob);
      cells[4].innerText = student.department;
      cells[5].innerText = student.placeOfBirth;
      cells[6].innerText = student.rate.toFixed(2);
      cells[7].innerText = student.note;

      // Reset form behavior to add student
      studentForm.reset();
      studentForm.removeEventListener("submit", updateStudent);
      studentForm.addEventListener("submit", addStudent);
    });
  }

  // Handle form submission for adding a new student
  function addStudent(event) {
    event.preventDefault();

    const student = {
      name: document.getElementById("name").value.trim(),
      surname: document.getElementById("surname").value.trim(),
      dob: document.getElementById("dob").value,
      department: document.getElementById("department").value.trim(),
      placeOfBirth: document.getElementById("placeOfBirth").value.trim(),
      rate: parseFloat(document.getElementById("rate").value),
      note: document.getElementById("note").value.trim()
    };

    addStudentToTable(student);

    // Add student to the array
    students.push(student);

    // Reset the form
    studentForm.reset();
  }

  // Function to generate PDF for a single student
  function printStudentToPDF(student) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text("Student Information", 10, 10);
    doc.text(`Name: ${student.name}`, 10, 20);
    doc.text(`Surname: ${student.surname}`, 10, 30);
    doc.text(`Date of Birth: ${student.dob}`, 10, 40);
    doc.text(`Age: ${calculateAge(student.dob)}`, 10, 50);
    doc.text(`Department: ${student.department}`, 10, 60);
    doc.text(`Place of Birth: ${student.placeOfBirth}`, 10, 70);
    doc.text(`Rate: ${student.rate.toFixed(2)}`, 10, 80);
    doc.text(`Note: ${student.note}`, 10, 90);

    doc.save(`${student.name}_${student.surname}_info.pdf`);
  }

  // Function to generate PDF for all students in a table format
  function downloadAllStudentsToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Table headers
    const headers = [
      [
        "Name",
        "Surname",
        "Date of Birth",
        "Age",
        "Department",
        "Place of Birth",
        "Rate",
        "Note"
      ]
    ];

    // Table rows
    const data = students.map((student) => [
      student.name,
      student.surname,
      student.dob,
      calculateAge(student.dob),
      student.department,
      student.placeOfBirth,
      student.rate.toFixed(2),
      student.note
    ]);

    // Generate table using autoTable
    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      theme: "grid"
    });

    // Save the generated PDF
    doc.save("all_students_info.pdf");
  }

  // Event listener for downloading all students as PDF
  downloadAllBtn.addEventListener("click", downloadAllStudentsToPDF);

  // Initial event listener for adding students
  studentForm.addEventListener("submit", addStudent);
});