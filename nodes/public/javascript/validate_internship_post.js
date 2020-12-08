function validate_internship_post(e) {
  console.log("Yes")
  var all_valid = true;

  //e.preventDefault();
  //Title
  if (document.getElementById('internshipTitle').value == '' || document.getElementById('internshipTitle').value.length > 255) {
    all_valid = false;
    document.getElementById('titleError').hidden = false;
  }
  else { document.getElementById('titleError').hidden = true; }
  //Email
  if (document.getElementById('internshipEmail').value == '' || document.getElementById('internshipEmail').value.length > 255 || !emailRegex.test(document.getElementById('internshipEmail').value)) {
    all_valid = false;
    document.getElementById('emailError').hidden = false;
  }
  else { document.getElementById('emailError').hidden = true; }
  //Kontakt person
  if (document.getElementById('contactName').value.length == '' || document.getElementById('contactName').value.length > 255) {
    all_valid = false;
    document.getElementById('contactError').hidden = false;
  }
  else { document.getElementById('contactError').hidden = true; }

  //Ansøgningsfrist
  if (!document.getElementById('applicationDeadline').value == '') {
    if (!dateRegex.test(document.getElementById('applicationDeadline').value)) {
      all_valid = false;
      document.getElementById('poststartdateError').hidden = false;
    }
    else { document.getElementById('poststartdateError').hidden = true; }
  }
  else { document.getElementById('poststartdateError').hidden = true; }

  //Ansættelsestidspunkt
  if (!document.getElementById('internshipEmploymentDate').value == '') {
    if (!dateRegex.test(document.getElementById('internshipEmploymentDate').value)) {
      all_valid = false;
      document.getElementById('postenddateError').hidden = false;
    }
    else { document.getElementById('postenddateError').hidden = true; }
  }
  else { document.getElementById('postenddateError').hidden = true; }

  //Opslagstekst
  if (document.getElementById('plainText').value.length > 65536) {
    all_valid = false;
    document.getElementById('posttextError').hidden = false;
  } else {
    document.getElementById('posttextError').hidden = true;
  }

  //CVR
  if (document.getElementById('countrySelect').value == 1) {
    if (!cvrRegex.test(document.getElementById('companyCVR').value)) {
      all_valid = false;
      document.getElementById('cvrError').hidden = false;
    } else {
      document.getElementById('cvrError').hidden = true;
    }
  } else {
    document.getElementById('cvrError').hidden = true;
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

  //Region
  if (document.getElementById('countrySelect').value == 1 && document.getElementById('regionSelect').value == 0) {
    all_valid = false;
    document.getElementById('regionError').hidden = false;
  }
  else {
    document.getElementById('regionError').hidden = true;
  }

  //By
  if (document.getElementById('countrySelect').value == 1 && document.getElementById('citySelect').value == 0) {
    all_valid = false;
    document.getElementById('cityError').hidden = false;
  } else {
    document.getElementById('cityError').hidden = true;
  }

  //Vedhæftet tekstfil
  if (document.getElementById('companyDoc').files[0] != null && document.getElementById('companyDoc').files[0].size >= 10240000) {

      all_valid = false;
      document.getElementById('companyDocError').hidden = false;
    }
  else {
    document.getElementById('companyDocError').hidden = true;
  }

  //Vedhæftet logo
  if (document.getElementById('companyLogo').files[0] != null && document.getElementById('companyLogo').files[0].size >= 10240000) {
    
      all_valid = false;
      document.getElementById('companyLogoError').hidden = false;
    }
    else {
      document.getElementById('companyLogoError').hidden = true;
    }
  console.log(all_valid);
  return all_valid;
}
