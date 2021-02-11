
function validate_internship_post() {
  let all_valid = true;

  //e.preventDefault();
  //Title
  if (document.getElementById('internshipTitle').value == '' || document.getElementById('internshipTitle').value.length > 255) {
    all_valid = false;
    document.getElementById('titleError').hidden = false;
  }
  else { document.getElementById('titleError').hidden = true; }

  //Opslagstype
  if (document.getElementById('postTypeSelect').value == 0) {
    all_valid = false;
    document.getElementById('postTypeError').hidden = false;
  } else {
    document.getElementById('postTypeError').hidden = true;
  }

  //Email
  if (document.getElementById('internshipEmail').value.length > 0) {
    if (document.getElementById('internshipEmail').value.length > 255 || !emailRegex.test(document.getElementById('internshipEmail').value)) {
      all_valid = false;
      document.getElementById('emailError').hidden = false;
    }
    else { document.getElementById('emailError').hidden = true; }
  } else { document.getElementById('emailError').hidden = true; }
  

  //Telefon
  if (document.getElementById('phoneNumber').value.length > 0) {
    if (!phoneRegex.test(document.getElementById('phoneNumber').value)) {
      all_valid = false;
      document.getElementById('phoneNumberError').hidden = false;
    } else {
      document.getElementById('phoneNumberError').hidden = true;
    }
  } else {
    document.getElementById('phoneNumberError').hidden = true;
  }

  //Kontakt person
  if (document.getElementById('contactName').value.length == '' || document.getElementById('contactName').value.length > 255) {
    all_valid = false;
    document.getElementById('contactError').hidden = false;
  }
  else { document.getElementById('contactError').hidden = true; }

  //Ansøgningsfrist
  let applicationDeadline = document.getElementById('applicationDeadline').value;
  if (applicationDeadline.length > 0) {
    let inputDate = new Date(applicationDeadline);
    let currDate = new Date();

    if (currDate > inputDate) {
      all_valid = false;
      document.getElementById('poststartdateErrorPast').hidden = false;
    } else {
      document.getElementById('poststartdateErrorPast').hidden = true;
    }
  } else {
    document.getElementById('poststartdateErrorPast').hidden = true;
  }

  //Ansættelsestidspunkt
  if (document.getElementById('postTypeSelect').value == 1) {
    let internshipEmploymentDate = document.getElementById('internshipEmploymentDate').value;
    if (internshipEmploymentDate.length > 0) {
      let inputDate = new Date(internshipEmploymentDate);
      let currDate = new Date();

      if (currDate > inputDate) {
        all_valid = false;
        document.getElementById('postenddateErrorPast').hidden = false;
      } else {
        document.getElementById('postenddateErrorPast').hidden = true;
      }
    } else {
      document.getElementById('postenddateErrorPast').hidden = true;
    }
  }

  //Opslagstekst
  if (document.getElementById('plainText').value.length > 65536) {
    all_valid = false;
    document.getElementById('posttextError').hidden = false;
  } else {
    document.getElementById('posttextError').hidden = true;
  }

  //Virksomheds Link
  if (!document.getElementById('companyURL').value == '') {
    if (!linkRegex.test(document.getElementById('companyURL').value)) {
      all_valid = false;
      document.getElementById('companylinkError').hidden = false;
    } else {
      document.getElementById('companylinkError').hidden = true;
    }
  } else {
    document.getElementById('companylinkError').hidden = true;
  }

  //Uddannelse
  if (document.getElementById('educationSelect').value == 0) {
    all_valid = false;
    document.getElementById('educationError').hidden = false;
  } else {
    document.getElementById('educationError').hidden = true;
  }

  //Land
  if (document.getElementById('countrySelect').value == 0) {
    all_valid = false;
    document.getElementById('countryError').hidden = false;
  } else {
    document.getElementById('countryError').hidden = true;
  }

  if (document.getElementById('countrySelect').value == 1) {
    if (document.getElementById('addressSearchUUID').value == '') {
      all_valid = false;
      document.getElementById('addressError').hidden = false;
    } else {
      document.getElementById('addressError').hidden = true;
    }
  }

  //Vedhæftet tekstfil
  if (document.getElementById('companyDoc').files[0] != null && document.getElementById('companyDoc').files[0].size > 10240000) {

      all_valid = false;
      document.getElementById('companyDocError').hidden = false;
    }
  else {
    document.getElementById('companyDocError').hidden = true;
  }

  if (!all_valid){
    return false;
  }
  else {
    document.forms["internshipForm"].submit();
  }
}
