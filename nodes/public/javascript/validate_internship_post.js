function validate_internship_post(e) {
    var all_valid = true;
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    var dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    var cvrReg = /^[0-9]{8}$/
    var linkReg = /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+).[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$/

    e.preventDefault();

    if (document.getElementById('internshipTitle').value == '' || document.getElementById('internshipTitle').value.length > 255) {
        all_valid = false;
        document.getElementById('titleError').hidden = false;
    }
    else { document.getElementById('titleError').hidden = true; }

    if (document.getElementById('internshipEmail').value == '' || document.getElementById('internshipEmail').value.length > 255 || !emailRegex.test(document.getElementById('internshipEmail').value)) {
        all_valid = false;
        document.getElementById('emailError').hidden = false;
    }
    else { document.getElementById('emailError').hidden = true; }

    if (document.getElementById('contactName').value.length == '' || document.getElementById('contactName').value.length > 255) {
        all_valid = false;
        document.getElementById('contactError').hidden = false;
    }
    else { document.getElementById('contactError').hidden = true; }

    if (!dateReg.test(document.getElementById('applicationDeadline').value)) {
        all_valid = false;
        document.getElementById('poststartdateError').hidden = false;
    }
    else { document.getElementById('poststartdateError').hidden = true; }

    if (!dateReg.test(document.getElementById('internshipEmploymentDate').value)) {
        all_valid = false;
        document.getElementById('postenddateError').hidden = false;
    }
    else { document.getElementById('postenddateError').hidden = true; }

    if (document.getElementById('plainText').value.length > 65536) {
        all_valid = false;
        document.getElementById('posttextError').hidden = false;
    }
    else { document.getElementById('posttextError').hidden = true; }

    if (!cvrReg.test(document.getElementById('companyCVR').value)) {
        all_valid = false;
        document.getElementById('cvrError').hidden = false;
    }
    else { document.getElementById('cvrError').hidden = true; }

    if (!linkReg.test(document.getElementById('companyURL').value)) {
        all_valid = false;
        document.getElementById('companylinkError').hidden = false;
    }
    else { document.getElementById('companylinkError').hidden = true; }

    if (document.getElementById('education').value == 0) {
        all_valid = false;
        document.getElementById('educationError').hidden = false;
    }
    else { document.getElementById('educationError').hidden = true; }

    if (all_valid) {
        return true;
    }
    else { return false; }
}