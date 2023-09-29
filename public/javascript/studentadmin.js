$(document).ready(function () {
    $('.student-status').change(function () {
        var studentId = $(this).data('student-id');
        var status = $(this).val();

        $.ajax({
            url: '/students/' + studentId + '/update',
            type: 'PUT',
            data: { status: status },
            success: function (response) {
                console.log('Student status updated successfully');

                // Update the DOM to reflect the status change
                var row = $(this).closest('tr');
                row.remove(); // Remove the row from the current tab

                // Add the row to the appropriate tab
                if (status === 'Approved') {
                    $('#nav-Approved table tbody').append(row);
                } else if (status === 'Declined') {
                    $('#nav-Declined table tbody').append(row);
                }
            },
            error: function (error) {
                console.log('Error updating student status');
            }
        });
    });
});



$(document).on('change', '.student-feeStatus', function () {
    var studentId = $(this).data('student-id');
    var feeStatus = $(this).val();
    console.log(studentId);
    console.log(feeStatus);

    $.ajax({
        url: '/students/' + studentId + '/feeUpdate',
        type: 'PUT',
        data: { feeStatus: feeStatus },
        success: function (response) {
            console.log('Student status updated successfully');
        },
        error: function (error) {
            console.log('Error updating student feeStatus');
        }
    });
});
$(document).on('change', '.student-feeStatus', function () {
    var registrationId = $(this).data('student-id');
    var feeStatus = $(this).val();

    // Store a reference to the current select element for updating the total amount
    var feeStatusSelect = $(this);

    // Check if the selected fee status is "Paid"
    if (feeStatus === 'Paid') {
        // Make an AJAX request to the server to delete the fees and update total amount
        $.ajax({
            url: '/registrations/' + registrationId + '/markPaid',
            type: 'PUT',
            success: function (response) {
                console.log('Registration fee marked as Paid successfully');

                // Update the UI to set total amount to zero
                feeStatusSelect.closest('tr').find('.me-auto').text('$0');
            },
            error: function (error) {
                console.log('Error marking registration fee as Paid');
            }
        });
    }
    // No need to handle other fee status changes
});


// SEARCH

$(document).ready(function () {
    // Function to perform the search and update the table
    var currentUser = true;

    function performSearch() {
        var searchValue = $('#searchInput').val().trim();

        // Hide all table bodies when there is a search query
        $('#approvedTableBody').hide();

        // Use Ajax to send the search query to the server
        $.ajax({
            url: '/admin/students/search',
            type: 'GET',
            data: { search: searchValue },
            success: function (response) {
                // Clear the results before appending new ones
                $('#approvedTable tbody').empty();

                response.forEach(function (student) {
                    var row = $('<tr>');
                    row.append('<th scope="row">' + student.student.studentNumber + '</th>');
                    row.append('<td>' + student.student.firstName + ' ' + student.student.lastName + '</td>');
                    row.append('<td>' + student.curriculum + '</td>');
                    row.append('<td>' + student.yearLevel + '</td>');
                    row.append('<td class="text-center" style="background-color: rgb(0, 179, 0);color: white;">' + student.status + '</td>');

                    var actionsTd = $('<td>'); // Create a <td> for actions

                    var dropdownMenu = $('<li class="nav-item dropdown">\
                        <a class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" href="#" role="button" \
                        data-bs-toggle="dropdown" aria-expanded="false">Update</a>\
                        <ul class="dropdown-menu dropdown-menu-end">\
                            <li class="text-center dropdown-item" data-toggle="modal" \
                                data-target="#studentDetailsModal" \
                                data-student=\'' + JSON.stringify(student) + '\' \
                                data-student-id=\'' + student._id + '\' \
                                style="cursor: pointer;">View Details</li>\
                            <li class="text-center">\
                                <form class="d-inline text-center dropdown-item" \
                                    action="/students/' + student._id + '?_method=DELETE" method="post">\
                                    <button style="border: none; background: none;">Delete</button>\
                                </form>\
                            </li>\
                            <li class="text-center">\
                                <a class="dropdown-item" data-bs-toggle="modal" \
                                    data-bs-target="#updateStudent' + student._id + '" \
                                    data-bs-whatever="@getbootstrap" style="cursor: pointer;">Update</a>\
                            </li>\
                            <li class="text-center">\
                                <a class="dropdown-item" data-bs-toggle="modal" \
                                    data-bs-target="#addFeeModal' + student._id + '" \
                                    data-bs-whatever="@getbootstrap" style="cursor: pointer;">Add Fee</a>\
                            </li>\
                            <li class="text-center">\
                                <a class="dropdown-item" data-bs-toggle="modal" \
                                    data-bs-target="#addGradeModal' + student._id + '" \
                                    data-bs-whatever="@getbootstrap" style="cursor: pointer;">Add Grade</a>\
                            </li>\
                        </ul>\
                    </li>');

                    // Create a <td> for the fee status select
                    var feeStatusTd = $('<td>').append('<select class="form-select form-select-sm student-feeStatus"\
                        aria-label=".form-select-sm example"\
                        data-student-id="' + student._id + '">\
                        <option ' + (student.feeStatus === 'Pending' ? 'selected' : '') + ' value="Pending">Pending</option>\
                        <option ' + (student.feeStatus === 'Paid' ? 'selected' : '') + ' value="Paid">Paid</option>\
                        <option ' + (student.feeStatus === 'Declined' ? 'selected' : '') + ' value="Declined">Declined</option>\
                    </select>');

                    // Append the fee status <td> to the row
                   

                    actionsTd.append(dropdownMenu);
                    row.append(actionsTd);
                    row.append(feeStatusTd);
                    row.append('<td class="me-auto">' + '$' + student.totalAmount + '</td>');
                    $('#approvedTableBody').append(row);
                    $('#approvedTableBody').show();
                });

                if (searchValue === '') {
                    $('#approvedTableBody').show();
                }
            },
            error: function (error) {
                console.log('Error searching for students');
            }
        });
    }

    $('#searchInput').on('input', function () {
        performSearch();
    });
    performSearch();
});


// MODAL

$(document).ready(function () {
    let studentId;

    function showStudentDetails(student) {
        console.log('Student object:', student);
        const studentNumber = student.student.studentNumber;
        const fullName = `${student.student.firstName} ${student.student.lastName}`;
        const Age = student.student.age;
        const Address = student.student.address;
        const Gender = student.student.gender;
        const curriculum = student.curriculum;
        const grade = student.yearLevel;
        const status = student.status;

        const fatherName = student.parents.fatherName;
        const motherName = student.parents.motherName;
        const fatherOccupation = student.parents.fatherOccupation;
        const motherOccupation = student.parents.motherOccupation;
        const phoneNumber = student.parents.phoneNumber;

        document.getElementById('studentNumber').textContent = studentNumber;
        document.getElementById('studentFullName').textContent = fullName;
        document.getElementById('studentAge').textContent = Age;
        document.getElementById('studentAddress').textContent = Address;
        document.getElementById('studentGender').textContent = Gender;
        document.getElementById('studentCurriculum').textContent = curriculum;
        document.getElementById('studentGrade').textContent = grade;
        document.getElementById('studentStatus').textContent = status;

        // Display parents' details
        document.getElementById('fatherName').textContent = fatherName;
        document.getElementById('motherName').textContent = motherName;
        document.getElementById('fatherOccupation').textContent = fatherOccupation;
        document.getElementById('motherOccupation').textContent = motherOccupation;
        document.getElementById('phoneNumber').textContent = phoneNumber;

        const studentImage = document.getElementById('studentImage');

        // Check if the images array is not empty
        if (student.images && student.images.length > 0) {
            studentImage.src = student.images[0].url;
        } else {
            // Handle the case where there are no images available
            studentImage.src = '/images/logo.png'; // Replace with a default image URL
        }

    }

    $('#studentDetailsModal').on('show.bs.modal', function (event) {
        console.log('Modal is shown');
        const button = $(event.relatedTarget);
        const studentId = button.data('student-id');
        const studentData = button.data('student');

        showStudentDetails(studentData);
      
    });
});

$(document).ready(function () {
    // ...

    // Event listener for tab change
    $('.nav-link').on('shown.bs.tab', function (e) {
        var activeTabId = $(e.target).attr('id');

        // Show the search bar if the "Approved" tab is active, hide it otherwise
        if (activeTabId === 'nav-Approved-tab') {
            $('#searchBarContainer').show();
        } else {
            $('#searchBarContainer').hide();
        }
    });

    // ...
});
