

 //primære methode som kalder de andre
 document.addEventListener('DOMContentLoaded', () => {
    let lang = document.documentElement.lang; // skaffer lang
    brugStrings(lang);
});
function brugStrings(lang) {
    var langdata = getLangdata();
    //køre igennem alt i dokumentet, leder efter data-key keys i html
    document.querySelectorAll('html [data-key]').forEach(element => {
        if(lang.includes('da')) {
             return;
        }

        //for hvert data-key værdi, leder den efter det i json navngivet langdata
        let key = element.getAttribute('data-key');

        if (!langdata.languages[lang].strings.hasOwnProperty(key)) {
            return;
        }

        if(key.includes('placeholder')) { // beregnet til input, så placeholder kan vises på dansk og engelsk
            element.placeholder = langdata.languages[lang].strings[key];
            return;
        }

        if(key.includes('input')) { // beregnet til input, så placeholder kan vises på dansk og engelsk
            element.value = langdata.languages[lang].strings[key];
            return;
        }

        if(key.includes('html')) {
            element.innerHTML = langdata.languages[lang].strings[key];
            return;
        }

        if (key.includes('tooltip')) {
            element.textContent = langdata.languages[lang].strings[key][0];
            element.title = langdata.languages[lang].strings[key][1];
            return;
        }

        element.textContent = langdata.languages[lang].strings[key];
    });
}

function getLangdata() {
    var temp = {"languages":{
        "en": {
            "strings": {
                // Mixed elements
                "opretBruger": "Sign Up",
                "sletBruger": "Delete User",
                "opret": "Create",
                "slet": "Delete",
                "Uddannelse": "Education",

                // Opret bruger
                "Studerende": "Students",
                "Virksomhed": "Company",
                "Alle_felter": "All fields must be filled",
                "labelGentagEmail": "Repeat email",
                "placeholderGentagEmail": "Repeat email",
                "labelAdgangskode_html": 'Password <span class="tooltiphelp" data-toggle="tooltip" data-placement="top"title="The password must be between 8 and 20 characters">?</span>',
                "placeholderAdgangskode": "Password",
                "labelGentagAdgangskode": "Repeat password",
                "placeholderGentagAdgangskode": "Repeat password",
                "Fornavn": "First name",
                "placeholderFornavn": "First name",
                "Efternavn": "Last name",
                "placeholderEfternavn": "Last name",
                "labelCvr": "CVR number",
                "placeholderCvr": "CVR number",
                "placeholderVirksomhedNavn": "Company name",
                "labelTelefonnummer": "Phone number",
                "placeholderTelefonnummer": "Phone number",
                "labelBy": "City",
                "placeholderBy": "City",
                "labelPostnummer": "Postcode",
                "placeholderPostnummer": "Postcode",
                "opretBruger": "Create user",
                "Foedselsdato": "Date of birth",
                "cookie": "Cookies must be enabled in your browser",
                "virk_bekraeft_samtykke_html": 'You must accept our <a class="link-primary" onclick="openCompanyConsent()"><b>declaration of consent on the use of personal information</b></a> in order to create a user on Zealand Connect.',
                "stud_bekraeft_samtykke_html": 'You must accept our <a class="link-primary" onclick="openDataConsent()"><b>declaration of consent on the use of personal information</b></a> in order to create a user on Zealand Connect.',
                "bekraeft_samtykke": "I confirm that I have read and understood Zealand Connect's declaration of consent on the use of personal information, as a basis for the consent to the processing of my personal data for the above purposes.",

                // Login
                //Studerende
                //Virksomhed
                //placeholderAdgangskode
                "Husk_email": "Remember email",
                //cookie
                "Opret_bruger": "Create user",

                // Frontpage
                "Arbejdstid_og_laeringsmaal": "Working time and learning objective",
                "Arbejdstid_og_laeringsmaal_body_html": "The intern must work 37 hours per week, incl. the work on an internship report in which the student will be examined after the internship. If the working time is outside normal working days, this must be agreed and stated in the internship agreement.<br><br>" +
                "The student’s tasks must be relevant and meet the learning objectives within the study programme in question. The tasks, which must be approved by the internship coordinator at Zealand, may be helpful in the daily work, in the conduction of analyses, development tasks etc.",

                "Loen": "Salary",
                "Loen_body_html": "The internship is unpaid – however, the internship is paid for students attending the Commerce Management (Danish: handelsøkonom) and laboratory technician study programmes.<br><br>" +
                "The student may receive a gratuity from the company upon completion of the internship. Such gratuity is not considered as salary but as an appreciation of the student’s effort and work during the internship.",

                "Forsikring": "Insurance",
                "Forsikring_body": "According to the Danish Workers’ Compensation Act (Danish: arbejdsskadesikringsloven) section 48 and 49, the internship company is obliged to insure the student during the internship period, as long as the internship takes place in Denmark.",

                "Praktikaftale": "Internship agreement",
                "Praktikaftale_body_html": "Zealand’s internship agreement is digital.<br><br>" +
                "The agreement is completed by the student, containing information on the student and the internship company. The internship coordinator at Zealand approves the internship agreement before it is sent to the company and the student for approval. For further questions regarding internships, please contact your internship coordinator.",

                "Praktikperiode": "Internship period",
                "Praktikperiode_body_html": "Overview of internship periods for the study programmes" + '<img src="/images/praktikperioder.jpg">',

                "For_virksomheden": "For the company",
                "For_virksomheden_body_html": "As part of the study programmes at Zealand, our students must do an internship. As a company, you have the opportunity to get an unpaid intern for 3 months. However, some study programmes have other internship agreements as regards duration, or the internship may be paid (read more under Salary).<br><br>" +
                "An internship serves multiple purposes and is very rewarding for the company as well as for the student. Our students are ready to contribute with their broad theoretical knowledge. In the company, the students have the opportunity to put their skills in practice and thus get valuable specific experience in return.<br><br>" +
                "The objective of the internship is to combine theories and tools from the study programme with the specific and practical challenges which companies meet every day.<br><br>" +
                "The company appoints a contact person for the intern. This person is in contact with the student on a daily basis and offers the opportunity to guide and help the student during the internship. Moreover, the contact person will have to complete a digital evaluation of the student and the cooperation with Zealand upon completion of the internship.",

                "For_studerende": "For the student",
                "For_studerende_body": "As a student at Zealand, an internship is a mandatory part of your study programme. The duration of the internship period depends on the study programme the student is following (see the schedule under Internship period).",

                "ZealandConnect_body": "Create an advertisement on Zealand Connect and find your next intern. In this advertisement, you describe what you can offer the student during the internship. If you want to search for an intern on your own, you can also screen the students’ CV's and contact them if their skills meet your needs.",

                "forside_slogan": "Zealand Connect - create your future",
                "forside_slogan_body": "With Zealand Connect you can easily find your future internship or workplace as you will find all vacancies here.",
                "Kalender": "Calendar",

                "student_quick_access_headline" : "For students",
                "student_quick_access_btn": "Find your next job or internship here. You can also increase your chances by creating a CV.",
                "student_quick_access_internship_headline": "Browse posts",
                "student_quick_access_internship_btn": "Browse a list of posts published by companies.",
                "student_quick_access_CV_headline": "Create CV",
                "student_quick_access_CV_btn": "Create a CV or edit an existing CV.",
                "company_quick_access_headline" : "For companies",
                "company_quick_access_btn": "Make your company visible to students by creating internship advertisements or job vacancies. You can also screen the available CV's.",
                "company_quick_access_CV_headline": "Browse CV list",
                "company_quick_access_CV_btn": "Find a suitable intern for your company.",
                "company_quick_access_post_headline": "Create post",
                "company_quick_access_post_btn": "Make your company visible to students by creating internship advertisements or job vacancies.",

                // Log ind som studerende
                "Log_paa_med_din_organizationskonto": "Log in to your account",
                "Log_paa": "Log in",
                "login_help": "Use your email to log in",
                "forgot_password": 'Forgot your password? Send a text message with the word "kodeord" to 50 76 27 10.',
                "email_placeholder": "someone@example.com",
                "password_placeholder": "Password",

                // Navbar
                "aKontakt": "Contact",
                "aStudentCVer": "Student CV's",
                "aProfessorCVer": "Professor CV's",
                "aAllePraktikopslag": "All company posts",
                "aAlleVirksomheder": "All companies",
                "aLavPraktikOpslag": "Create post",
                "aVirksomheder": "Companies",
                "aOpslag": "Posts",
                "aFaktaOmPraktik": "About internship",
                "aAdministratorfunktioner": "Administrator functions",
                "aPraktikForloebet": "Internship Course",
                "aArbejdstidOgLæringsmål": "Working hours and Learning Objectives",
                "aLoen": "Salary",
                "aSamarbajdeOgSparring": "Cooperation and Sparring",
                "aForsikring": "Insurance",
                "aKontaktperson": "Contact",
                "aPraktikkontrakten": "Internship Contract",
                "aEvtProblemer": "Issues",
                "aForStuderende": "For Students",
                "aLogin": "Login",
                "aLogud": "Log out",
                "aProfil": "Profile",
                "aMitCV": "My CV",
                "aMinePraktikOpslag": "My company posts",
                "aOpretBruger": "Create user",

                // search-cv
                "CV'er": "CV's",
                "Uddannelser_html": 'Education <img src="images/chevron-right.svg" width="12" height="12">',
                "Land_html": 'Country <img src="images/chevron-right.svg" width="12" height="12">',
                "Afstand_html": 'Distance <img src="images/chevron-right.svg" width="12" height="12">',
                "CVtyper_html": 'CV types <img src="images/chevron-right.svg" width="12" height="12">',
                "Indland": "Domestic",
                "Udland": "Abroad",
                "resultater": "results",
                "Sortering": "Sort by:",
                "Senest_opdateret": "Recently updated",
                "Senest_opdateret:": "Updated at:",
                "Oprettelsesdato": "Date created",
                "Ansøgningsfrist": "Application deadline",
                "Raekkefoelge": "Order:",
                "Faldende": "Descending",
                "Stigende": "Ascending",
                "Indtast_adresse": "Specify address",
                "Indtast_adresse_tooltip": ["?", "Specify your address together with a radius to focus your search. this filter only works on CV's that have a postcode specified and supports only Danish addresses."],
                "Radius_i_kilometer": "Radius in kilometers",

                //Pagination
                "Foerste": "First",
                "Forrige": "Previous",
                "Naeste": "Next",
                "Sidste": "Last",

                //Uddannelser
                "Datamatiker": "Computer Scientist",
                "Handelsøkonom": "Commerce Management",
                "Finansøkonom": "Financial Management",
                "Serviceøkonom": "Service Management",
                "Markedsføringsøkonom": "Marketing Management",
                "Administrationsøkonom": "Administration Management",
                "International Handel og Markedsføring": "International Sales and Marketing",
                "Innovation og Entrepreneurship": "Innovation and Entrepreneurship",
                "Bygningskonstruktør": "Constructing Architect",
                "Byggetekniker": "Building Technician",
                "Installatør, stærkstrøm": "Electrician",
                "VVS-installatør": "Plumbing Installer",
                "Urban Landskabsingeniør": "Urban Landscape Engineer",
                "Jordbrug": "Agriculture",
                "Jordbrugsteknolog": "Agricultural Technology",
                "Laborant": "Laboratory Technician",
                "Procesteknolog": "Process Technology",
                "Autoteknolog": "Automotive Technology",
                "Digital Konceptudvikling": "Digital Concept Development",
                "Multimediedesigner": "Multimedia Design and Communication",
                "Produktionsteknolog": "Production Technology",
                "Web Development": "Web Development",
                "IT-sikkerhed": "IT Security",

                // search-praktik
                "Opslag": "Posts",
                "Opslagstype_html": 'Post type <img src="images/chevron-right.svg" width="12" height="12">',
                //Uddannelser_html,
                //Land_html,
                //Indland,
                //Udland,
                "By_html": 'City <img src="images/chevron-right.svg" width="12" height="12">',
                "Indtast_postnummer": "Enter postcode",
                "Soeg": "Search",
                "Ryd": "Clear",
                "Fri_soegning_html": 'Free search <img src="images/chevron-right.svg" width="12" height="12">',
                "Soegefelt": "Search box",
                "Indtast_search_tooltip": ["?", "Specify key words seperated by spaces"],
                //resultater,
                //Sortering,
                //Senest_opdateret,
                //Raekkefoelge
                //Faldende,
                //Stigende
                "Region Hovedstaden": "The Capital Region",
                "Region Midtjylland": "Central Denmark Region",
                "Region Nordjylland": "Northern Denmark Region",
                "Region Sjælland": "Zealand Region",
                "Region Syddanmark": "Southern Denmark Region",

                //search-praktik-card
                "Uddannelse_kolon": "Education:",
                "Ansoegningsfrist_kolon": "Application deadline:",
                "Praktikstart_kolon": "Internship start:",
                "Ingen": "None",
                "Soeger:": "Searching for:",
                "m.fl.": "and others",

                //Opslagstyper
                "Praktik": "Internship",
                "Studiejob": "Student job",

                //cv
                "Navn_kolon": "Name:",
                "Tlf_kolon": "Phone:",
                "Hjemmeside_kolon": "Website:",
                "Rediger_CV": "Edit CV",
                "Overskrift": "Headline",
                "Om_mig": "About me",
                "Jeg_søger": "I'm looking for",
                "Trainee_stilling": "Trainee position",
                "Fuldtidsstilling": "Full time employment",
                "Erhvervserfaring": "Work experience",
                //"Uddannelse": "Education",
                "Speciale": "Speciality",
                "Tidligere_uddannelse": "Past education",
                "Udlandsophold_og_frivilligt_arbejde": "Study abroad and volunteer work",
                "Fritidsinteresser": "Hobbies",
                "It_kompetencer": "IT skills",
                "Sprog": "Language",
                "Ikke_angivet": "Not specified",
                "Opslag_paa_mail": "Email opt-in",
                "emailOptInOption1": "Receive an email when a relevant post is made by a company",
                "CV_info_box_title": "The validity of your CV",
                "CV_info_box": "Your CV is valid as long as you've been active within the last 6 months or you delete it " +
                    "by yourself. " +
                    "After 6 months of inactivity your CV will be set to private meaning only you can see it.",

                //internship_post
                "Rediger_opslag": "Edit post",
                "Indryk_opslag": "Create post",
                "Annonce_overskrift": "Post headline",
                "Annonce_overskrift_placeholder": "Title",
                "Annonce_overskrift_error": "You must specify a post headline",
                "Opslagstype": "Post type",
                "Vaelg_en_opslagstype": "Choose a post type",
                "internship_info_box_title": "The validity of your post",
                "internship_info_box": "Your post is valid until the expiration date. If you do not specify an expiration " +
                    "date the post will be valid as long as your account has been active within 6 months or until you " +
                    "delete it yourself. " +
                    "After 6 months of inactivity the post will be hidden, but you have the option of showing it again.",
                //Praktik
                //Studiejob
                "Opslagstype_error": "You must specify a post type",
                //Uddannelse
                "Vaelg_en_uddannelse": "Select one or more educations",
                "Vaelg_en_uddannelse_error": "You must specify an education",
                "Vaelg_en_uddannelse_note": "The selected education has paid internship",
                "Land": "Country",
                "Land_tooltip": ["?", "If Denmark is selected as country, a field to specify address will appear on the right which must also be filled"],
                "Vaelg_et_land": "Select a country",
                "Vaelg_et_land_error": "You must specify a country",
                "Danmark": "Denmark",
                "Tyskland": "Germany",
                "Sverige": "Sweden",
                "Udlandet": "Other",
                "Adresse": "Address",
                "Adresse_tooltip": ["?", "This field uses DAWA (Danmarks Adressers Web API) to fill it. DAWA is a service which can search Danish addresses. To make sure a correct address is specified, the address must be visible in grey under the field"],
                "Adresse_error": "You must specify an address",
                "Email_adresse": "E-mail address",
                "Email_adresse_error_optional": "You must specify a valid email with at least one @ or empty the field",
                "Telefonnummer": "Phone number",
                "Telefonnummer_placeholder": "Phone number",
                "phoneNumberError": "You must specify a valid phone number or empty the field",
                "Navn_paa_kontaktperson": "Name of contact person",
                "Navn_paa_kontaktperson_placeholder": "Name",
                "Navn_paa_kontaktperson_error": "You must specify a contact person",
                "Link_til_hjemmeside": "Link to website",
                "Link_til_hjemmeside_error": "If a link is specified, it must be valid, e.g. http://www.zealandconnect.dk",
                "Ansoegningsfrist_html": 'Application deadline <span class="tooltiphelp" data-toggle="tooltip" data-placement="top" title="If there\'s no application deadline, the post can only be removed manually" data-Key="">?</span>',
                "Ansoegningsfrist_error": "You must specify an application deadline",
                "Dato_error": "The selected date has already passed",
                "Ansoegningsfrist_note": "Hide post after application deadline?",
                "Praktikstart": "Internship start",
                "Praktikstart_error": "You must specify a date for internship start",
                //Dato_error
                "Vedhaeft_fil_html": 'Attach file <span class="tooltiphelp" data-toggle="tooltip" data-placement="top" title="File types: .pdf, .docx, .doc, .txt. Max. file size: 10MB.">?</span>',
                "Nuvaerende_Vedhaeftet_fil": "Currently attached file",
                "Vaelg_fil": "Choose file",
                "Vaelg_fil_error": "The chosen file must have a size less than 10MB",
                "Opslagstekst": "Post text",
                "Du_har_angivet_for_mange_tegn": "You have used too many characters",
                "Gem": "Save",
                "Slet_dette_opslag": "Delete this post",
                "Ryd": "Clear",
                "Brug_info": "Use info from profile",
                "Brug_profil_mail": "Use login mail",

                //intership_post_view
                //Uddannelse_kolon
                "Land_kolon": "Country:",
                "By_kolon": "City:",
                "Postnummer_kolon": "Postcode:",
                "Kontaktperson_kolon": "Contact person:",
                "CVR_nummer_kolon": "CVR number:",
                //Hjemmeside_kolon
                "Vedhaeftet_fil_kolon": "Attached file:",
                "Rediger_oplag": "Edit post",
                "Annoncetekst_kolon": "Post text:",

                //cv
                //Overskrift
                "Overskrift_placeholder": "What you're looking for e.g. job or internship",
                "Skal_udfyldes": "Required field",
                //Vaelg_en_uddannelse
                //Vaelg_en_uddannelse_error
                //Email_adresse
                "Email_adresse_error": "An email must have one @ character",
                //Sprog
                "Sprog_error": "You must specify language here",
                //Speciale
                "Telefon": "Telephone",
                "Postnummer_tooltip": ["?", "When you  specify a postcode, the associated city is automatically shown on the CV. This field makes it possible for companies to focus their search and can help make you visible to them. Only Danish postcodes are supported."],
                "Telefon_error": "You must specify a telephone number",
                "linkedIn_error": "You must specify a working link to a LinkedIn profile or clear the field",
                "youtube_error": "You must specify a working link to a Youtube video or clear the field",
                "hjemmeside_error": "You must specify a working link to your website or clear the field",
                "Postnummer_errorCV": "Only Danish postcodes are allowed and specify only the numbers. The associated city will automatically be found",
                "Link_til_CV_paa_Youtube": "Link to CV on Youtube",
                "Link_til_CV_paa_Youtube_tooltip": ["?", "If you've uploaded a video CV on Youtube, you can refer to the video here."],

                //Om_mig
                "Om_mig_placeholder": "Describe yourself",
                //It_kompetencer
                "Valgfri_placeholder": "Optional",
                //Udlandsophold_og_frivilligt_arbejde
                //"Erhvervserfaring": "Work experience",
                "Erhvervserfaring_placeholder": "Previous or current work experience",
                "Tidligere_udannelse": "Previous education",
                "Tidligere_udannelse_placeholder": "Describe previous or current education",
                //Skal_udfyldes
                "Hjemmeside": "Website",
                //Fritidsinteresser
                "Tilgængelighed": "Accessibility",
                "Offentlig": "Public",
                "Kun_synlig_for_brugere": "Only visible to users",
                "Privat": "Private",
                "Tilgængelighed_error": "You must specify if your CV is public, private or only visible to users",
                //Gem

                //studentprofil
                "Profil": "Profile",
                //Navn_kolon
                "Mail_kolon": "Mail:",
                //Tlf_kolon
                "Rediger_profil": "Edit profile",
                "Slet_brugerkonto": "Delete user account",
                "Gentag_password": "Repeat password",
                "Ugyldigt_fornavn": "Invalid first name",
                "Ugyldigt_efternavn": "Invalid last name",
                "Ugyldigt_password": "Invalid password",
                "Password_matcher_ikke": "Passwords do not match",
                //virksomhedprofil
                //"Virksomhed": "Company",
                //Navn_kolon
                //Mail_kolon
                //Tlf_kolon
                "Adresse_kolon": "Address:",
                //Hjemmeside_kolon
                //Land_kolon
                //Postnummer_kolon
                //By_kolon
                //Rediger_profil
                "Om_virksomheden": "About the company",

                //rediger-studentprofil
                //Fornavn
                //Skal_udfyldes
                //Efternavn
                //Skal_udfyldes
                //Telefon
                //Telefon_error
                //Gem
                "Profilbillede": "Profile picture",
                "Profilbillede_tooltip": ["?", "Filtypes: .jpg, .jpeg, .png. Min. width: 250px. Min. height: 250px. Max. file size: 10MB. The picture can be cropped when selected."],
                "Vaelg_billede": "Choose picture",
                "Vaelg_billede_error": "You can only upload a file of maximun 10MB size",

                //rediger-virksomhedsprofil
                "Virksomheds_navn": "Company name",
                //Skal_udfyldes
                //Email_adresse_error
                //Telefon
                //Telefon_error
                "CVR_nummer": "CVR Number",
                "CVR_nummer_error": "You must specify a CVR number with 8 digits, not beginning with 0",
                //Skal_udfyldes
                //Hjemmeside
                //Skal_udfyldes
                //Land
                //Skal_udfyldes
                "Postnummer": "Postcode",
                "Postnummer_error": "You must specify a postcode of exactly 4 characters",
                "By": "City",
                //Skal_udfyldes
                //Gem
                "Virksomhedslogo": "Company logo",
                //Profilbillede_title
                //Vaelg_billede
                //Vaelg_billede_error
                "Aendrer_password": "Change password",
                "Gamle_password": "Old password",
                "Gamle_passwordError": "The password isn't correct",
                "Nyt_password_html": 'New password<span class="tooltiphelp" data-toggle="tooltip" data-placement="top" title="The password must be between 8 and 20 characters">?</span>',
                "Nyt_passwordError": "The password is invalid",
                //Gentag_password
                "Gentag_passwordError": "The two passwords aren't the same",
                "Bekraeft": "Confirm",
                "Goer_mail_synlig": "Make mail visible on public profile",
                "Om_virksomheden_tooltip": ["?", "Write a short description of your company's primary objectives and core values"],

                //change-email-modal
                "Skift": "Change",
                "Ny_email": "New email",
                "nyEmailError": "The email is invalid",
                "brugtEmailError": "The email is already in use",
                "gentagEmailError": "The email isn't the same",
                "emailPasswordError": "The password is incorrect",
                "email_success": "Email has been changed. The page will refresh in a moment",

                //search-virksomheder
                "Navn": "Name",
                "virksomheder_registreret": "companies registered",
                "Virksomheder": "Companies",

                //admin-funktioner
                "Slet_studerende": "Delete student account",
                "Slet_virksomhed": "Delete company account",
                "adminFunktion": "Administrative functions",
                "Opret_uddannelse": "Create education",
                "Slet_uddannelse": "Delete education",

                //forgot-password
                "Email_label": "Enter an email address and you will receive an e-mail for resetting your password.",
                "Glemt_password": "Password recovery",

                //reset-password
                "Password_hint_error": "The password is invalid. Hover over the yellow question mark for help.",
                "Nulstil_adgangskode": "Reset password",
                "Password_reset_success": "Password reset. Please log in using your new password.",
                "Token_not_found": "The token you specified no longer exists. Try the password recovery process again.",
                "Token_ikke_fundet": "Token not found",
                "Token_expired": "The token you specified has expired. Try the password recovery process again.",
                "Token_udloebet": "Token expired",

                //footer
                "Samtykke": "Declaration of consent",

                //data-consent
                "Luk": "Close",
                "data_consent_title": "Consent to the processing of personal information",
                "data_consent_header1": "Zealand Connect",
                "data_consent_paragraph1": "As part of your user registration at Zealand Connect, we need your consent to process your personal data in accordance with the General Data Protection Regulation.",
                "data_consent_header2": "Project description",
                "data_consent_paragraph2": "Zealand Connect is a platform where companies have the opportunity to find interns and where students can submit a CV to match with a company.",
                "data_consent_header3": "Data controller",
                "data_consent_paragraph3": "Zealand, Lyngvej 21, 4600 Køge, CVR no. 31661471 is responsible for the processing of your personal information. For correspondence in regards to the responsibility of personal data please contact zcsupport@zealand.dk.",
                "data_consent_header4": "Categories of personal information about you that are processed.",
                "data_consent_paragraph4": "We process common personal information in the form of name, mailaddress, cell phone number as well as other possible information that you provide in your CV.",
                "data_consent_header5": "Purpose and processing activities",
                "data_consent_paragraph5": "Your personal information is used with the intent to give companies the opportunity to find capable students for internship and for you to find a location for your internship.",
                "data_consent_header6": "Possible recipients or categories of recipients of your the personal data",
                "data_consent_paragraph6": "Your personal information will be published at https://connect.zealand.dk/ and will be made freely available to companies, fellow students, other stakeholders etc. This is not a closed forum.",
                "data_consent_header7": "Transferring to Third Country or International Organization",
                "data_consent_paragraph7": "We will not hand over your personal information to anyone outside the EU/EEA.",
                "data_consent_header8": "Storage time",
                "data_consent_paragraph8": "We store your personal information for one year from the last login date as long as you have given your consent.",
                "data_consent_header9": "The possibility to withdraw consent",
                "data_consent_paragraph9": "Participation is voluntary and you can at any time withdraw your consent to the processing of personal information. This can be done by contacting zcsupport@zealand.dk. You can also delete your information and CV at any time by logging in at Zealand Connect. If you withdraw your consent it will only take effect from this moment and will not affect the legality of our use of personal information until now.",

                "company_consent_paragraph4": "We process common personal information in the form of name, mailaddress, mobile number as well as other possible information that you provide.",
                "company_consent_paragraph5": "The personal information is processed for the purpose of finding suitable students for internships in the company.",
                "company_consent_paragraph6": "Information that you submit will be published at https://connect.zealand.dk/ and will be made freely available to companies, students, other stakeholders etc. This is not a closed forum.",

                //cookie-policy
                "Cookie-politik": "Cookie policy",
                "cookie_politik_title": "Cookies",
                "cookie_politik_header1": "What cookies do we use?",
                "cookie_politik_paragraph1": "On this page you'll find a list of cookies that our site stores on computer as well as directions on how to withdraw consent or delete them.",
                "cookie_politik_header2": "Cookie consent",
                "cookie_politik_paragraph2": "When you accept our cookie policy your consent is also stored in a cookie. This cookie expires after 30 days.",
                "cookie_politik_header3": "Language settings",
                "cookie_politik_paragraph3": "We use cookies to manage the language you have selected. Therefore you cannot change language if you haven't accepted preference cookies. These cookies expire after 30 days.",
                "cookie_politik_header4": "Session cookies",
                "cookie_politik_paragraph4": "When you log in to Zealand Connect, a cookie with session data is created. This cookie means that you will not be logged out when you leave the site. This cookie is necessary for the site to function and expires after 2 hours.",
                "cookie_politik_header5": "Cookie storage",
                "cookie_politik_paragraph5": "We do not store cookies in our database. Your browser stores cookies until they expire or you delete them.",
                "cookie_politik_header6": "Additional information",
                "cookie_politik_header7": "This website is provided by:",
                "cookie_politik_header8": "Cookie regulation",
                "cookie_politik_paragraph7": 'All Danish websites are required to inform their users about cookies downloaded to their device. The information must comply with ”Bekendtgørelse om krav til information og samtykke ved lagring af og adgang til oplysninger i slutbrugeres terminaludstyr”.',
                "cookie_politik_paragraph8_html": 'The regulation requires that the website receives consent from the user when the website wants to store cookies on the user\'s device. Read more about "The Cookie Regulation": <a href="http://erhvervsstyrelsen.dk/cookies">http://erhvervsstyrelsen.dk/cookies</a>.',
                "Generel_information": "General information",
                "cookie_question_1": "What are cookies?",
                "cookie_answer_1": "A cookie is a small text file that is stored in your browser and is used to recognize " +
                    "your device with recurring visits. There is no personal information stored in our cookies and they " +
                    "cannot contain viruses.",
                "cookie_answer_1_2": "When you visit Zealand's websites your device will automatically receive one or more" +
                    "cookies.",
                "cookie_question_2": "How long are cookies stored on my device?",
                "cookie_answer_2": "Cookies are automatically deleted after a certain number of months. When exactly it's" +
                    "deleted varies by the type of cookie although they are always renewed upon recurring visits. You can" +
                    "delete cookies on your device by yourself at any point in time.",
                "cookie_question_3": "How to avoid/delete cookies",
                "cookie_answer_3": "If you do not wish to store cookies on your computer you can read directions on how " +
                    "to fully or partially avoid receiving cookies as well as how to delete the cookies that are already " +
                    "stored on your device.",
                "cookie_answer_3_2": "How to delete cookies:",
                "cookie_link_1": "Delete cookies in Internet Explorer",
                "cookie_link_2": "Delete cookies in Mozilla Firefox",
                "cookie_link_3": "Delete cookies in Google Chrome",
                "cookie_link_4": "Delete cookies in Safari",
                "cookie_link_5": "Delete cookies in Opera",
                "cookie_link_6": "Delete cookies on iPad, iPhone or iPod Touch",
                "cookie_link_7": "Delete cookies on Android device",
                "cookie_link_8": "Delete flash cookies (all browsers)",
                "cookie_answer_3_3": "If you're using a browser not mentioned above you must find the proper directions" +
                    " in that browser's guide section. If you do not wish to receive cookies, you can block them.",
                "Persondatapolitik": "Personal Data Policy",
                "cookie_answer_4": "Read about Zealand's Personal Data Policy here",

                // Nyheder
                "forside_nyhed_h_1": "New feature on Zealand Connect - receive new internship and job posts in your mailbox",
                "forside_nyhed_p_1": "As a student you can now choose which types of posts that are relevant for you. You " +
                "have the option of internship, study job, trainee and full time job. In your CV you can check the box \"" +
                    "receive relevant posts in your mailbox\" you will receive an email when a relevant post is made by " +
                    "a company. We check if the post matches your education and what you're looking for.",
                "forside_nyhed_h_2": "New feature on Zealand Connect - save interesting posts and CV's to your favourites",
                "forside_nyhed_p_2_html": 'Zealand Connect now has a function for saving posts and CV\'s as favourites. Companies ' +
                    'can save CV\'s and students can save posts. You save a CV or a post by going to the list of posts/CV\'s ' +
                    'and clicking on the star <i class="far fa-star"></i> that\'s located by each post/CV. Your favourites ' +
                    'can be found by clicking on your name in the top bar and choosing "My favourite...". This way you can ' +
                        'quickly find posts or CV\'s that you\'ve liked earlier.',
                "memes_html": '<i class="far fa-star"></i>',
                "forside_nyhed_h_3": "Career Day on 7th May 2021",
                "forside_nyhed_p_3_1": "On Friday 7th May we held our first virtual Career Day across the majority of our " +
                    "educations at Zealand in Næstved.",
                "forside_nyhed_p_3_2": 'The purpose of Career Day is to gather our partners and create more awareness of ' +
                    'our educations and students. Furthermore, the internship platform Zealand Connect was introduced and ' +
                    'it was well received by both companies and students - awesome! The keychain in the image below is created ' +
                    'in FABLAB by Helle Hauskov. The keychain was sent to all participating companies and students with ' +
                    'the message "Join Zealand Connect". The keychain symbolises the cooperation between Zealand, the ' +
                    'students and the companies. Besides the good vibes and matchmaking between students and companies, ' +
                    'we were fortunate that Peter Juul Regnergaard who is co-founder of the company TRUE GUM held an ' +
                    'inspiring presentation. The presentation focused on innovation, entrepreneurship and sustainability.',
                "forside_nyhed_p_3_3": "Many thanks to all the participating companies and students.",
                // Favourites
                "Mine_foretrukne_cver": "My favourite CV's",
                "Mine_foretrukne_opslag": "My favourite posts",

                // Kontakt
                "Praktikkoordinatorer": "Internship Coordinators",
                "Contact_headline_2": "Development and support of Zealand Connect",
                "Alle_uddannelser": "All educations",

                //Professor CV
                "Kort_præsentation": "Short presentation",
                "Tidligere_projekter": "Past projects",
                "Interesser": "Hobbies",
                "Hjemmeside:": "Website:",
                "Afdeling:": "Campus:",
                "Tilknyttet_uddannelse:": "Associated education:",
                "Stilling:": "Position:",
                "Underviser_i:  ": "Teaches:"
            }
        }
    }
    }
    return temp;
}
