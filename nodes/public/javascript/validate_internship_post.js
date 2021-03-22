
const inputs = Object.freeze({
  internshipTitle: document.getElementById('internshipTitle'),
  postTypeSelect: document.getElementById('postTypeSelect'),
  internshipEmail: document.getElementById('internshipEmail'),
  phoneNumber: document.getElementById('phoneNumber'),
  contactName: document.getElementById('contactName'),
  applicationDeadline: document.getElementById('applicationDeadline'),
  internshipEmploymentDate: document.getElementById('internshipEmploymentDate'),
  plainText: document.getElementById('plainText'),
  companyURL: document.getElementById('companyURL'),
  educationSelect: document.getElementById('educationSelect'),
  countrySelect: document.getElementById('countrySelect'),
  addressSearchUUID: document.getElementById('addressSearchUUID'),
  companyDoc: document.getElementById('companyDoc')
});

const errors = Object.freeze({
  titleError: document.getElementById('titleError'),
  postTypeError: document.getElementById('postTypeError'),
  emailError: document.getElementById('emailError'),
  phoneNumberError: document.getElementById('phoneNumberError'),
  contactError: document.getElementById('contactError'),
  poststartdateErrorPast: document.getElementById('poststartdateErrorPast'),
  postenddateErrorPast: document.getElementById('postenddateErrorPast'),
  posttextError: document.getElementById('posttextError'),
  companylinkError: document.getElementById('companylinkError'),
  educationError: document.getElementById('educationError'),
  countryError: document.getElementById('countryError'),
  addressError: document.getElementById('addressError'),
  companyDocError: document.getElementById('companyDocError')
});

function checkInputNotEmpty(input, error) {
  let value = input.value; 
  
  if (!value) {
      error.hidden = false;
      return false;
  } else {
      error.hidden = true;
      return true;
  }
};

function checkInputNotEmptyWithLimit(input, error, limit) {
  let value = input.value; 
  
  if (!value || value.length > limit) {
      error.hidden = false;
      return false;
  } else {
      error.hidden = true;
      return true;
  }
};

function checkInputRegex(input, error, regex) {
  let value = input.value;

  if (!regex.test(value)) {
      error.hidden = false;
      return false;
  } else {
      error.hidden = true;
      return true;
  }
};

function checkInputRegexWithLimit(input, error, regex, limit) {
  let value = input.value;

  if (!regex.test(value) || value.length > limit) {
      error.hidden = false;
      return false;
  } else {
      error.hidden = true;
      return true;
  }
};

function checkInputRegexOptional(input, error, regex) {
  let value = input.value;

  if (value && !regex.test(value)) {
      error.hidden = false;
      return false;
  } else {
      error.hidden = true;
      return true;
  }
};

function checkInputRegexOptionalWithLimit(input, error, regex, limit) {
  let value = input.value;

  if (value && !regex.test(value) || value.length > limit) {
      error.hidden = false;
      return false;
  } else {
      error.hidden = true;
      return true;
  }
};

function checkInputUnderLimit(input, error, limit) {
  let value = input.value; 
  
  if (value > limit) {
      error.hidden = false;
      return false;
  } else {
      error.hidden = true;
      return true;
  }
};

function checkNotInPast(input, error) {
  let date = input.value;
  
  if (date) {
    let inputDate = new Date(date);
    let currDate = new Date();

    if (currDate > inputDate) {
      error.hidden = false;
      return false;
    } else {
      error.hidden = true;
      return true;
    }
  } else {
    error.hidden = true;
    return true;
  }
};

function checkUnderFileSizeLimit() {
  let file = inputs.companyDoc.files[0];

    if (file != null && file.size > 10240000) {

      errors.companyDocError.hidden = false;
      return false;
    } else {

      errors.companyDocError.hidden = true;
      return true;
    }
};

function addChangeEvents() {
  inputs.internshipTitle.addEventListener('change', function () {
    checkInputNotEmptyWithLimit(inputs.internshipTitle, errors.titleError, 255);
  });

  inputs.postTypeSelect.addEventListener('change', function () {
    checkInputNotEmpty(inputs.postTypeSelect, errors.postTypeError);
  });

  inputs.internshipEmail.addEventListener('change', function () {
    checkInputRegexOptionalWithLimit(inputs.internshipEmail, errors.emailError, emailRegex, 255);
  });

  inputs.phoneNumber.addEventListener('change', function () {
    checkInputRegexOptional(inputs.phoneNumber, errors.phoneNumberError, phoneRegex);
  });

  inputs.contactName.addEventListener('change', function () {
    checkInputNotEmptyWithLimit(inputs.contactName, errors.contactError, 255);
  });

  inputs.applicationDeadline.addEventListener('change', function () {
    checkNotInPast(inputs.applicationDeadline, errors.poststartdateErrorPast);
  });

  inputs.internshipEmploymentDate.addEventListener('change', function () {
    checkNotInPast(inputs.internshipEmploymentDate, errors.postenddateErrorPast);
  });

  inputs.plainText.addEventListener('change', function () {
    checkInputUnderLimit(inputs.plainText, errors.posttextError, 65536);
  });

  inputs.companyURL.addEventListener('change', function () {
    checkInputRegexOptional(inputs.companyURL, errors.companylinkError, linkRegex);
  });

  inputs.educationSelect.addEventListener('change', function () {
    checkInputNotEmpty(inputs.educationSelect, errors.educationError);
  });

  inputs.countrySelect.addEventListener('change', function () {
    checkInputNotEmpty(inputs.countrySelect, errors.countryError);
  });

  inputs.companyDoc.addEventListener('change', function () {
    checkUnderFileSizeLimit();
  });
};
addChangeEvents();

function validate_internship_post() {
  let all_valid = true;

  let checkInputs = [
    checkInputNotEmptyWithLimit(inputs.internshipTitle, errors.titleError, 255),
    checkInputNotEmpty(inputs.postTypeSelect, errors.postTypeError),
    checkInputRegexOptionalWithLimit(inputs.internshipEmail, errors.emailError, emailRegex, 255),
    checkInputRegexOptional(inputs.phoneNumber, errors.phoneNumberError, phoneRegex),
    checkInputNotEmptyWithLimit(inputs.contactName, errors.contactError, 255),
    checkNotInPast(inputs.applicationDeadline, errors.poststartdateErrorPast),
    checkNotInPast(inputs.internshipEmploymentDate, errors.postenddateErrorPast),
    checkInputUnderLimit(inputs.plainText, errors.posttextError, 65536),
    checkInputRegexOptional(inputs.companyURL, errors.companylinkError, linkRegex),
    checkInputNotEmpty(inputs.educationSelect, errors.educationError),
    checkInputNotEmpty(inputs.countrySelect, errors.countryError),
    checkUnderFileSizeLimit()
  ];

  checkInputs.every(input => {
    if (!input) {
        all_valid = false;
        return false;
    }
    return true;
  });

  if (!all_valid){
    return false;
  }
  else {
    document.forms["internshipForm"].submit();
  }
}

function rydFrist() {
  inputs.applicationDeadline.value = '';
  checkNotInPast(inputs.applicationDeadline, errors.poststartdateErrorPast)
}

function rydPraktik() {
  inputs.internshipEmploymentDate.value = '';
  checkNotInPast(inputs.internshipEmploymentDate, errors.postenddateErrorPast)
}
