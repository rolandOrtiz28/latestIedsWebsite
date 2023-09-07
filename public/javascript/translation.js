i18next.init({
    lng: 'en', // Default language
    resources: {
        en: {
            translation: {
                VisionTitle: "VISION",
                MissionTitle: "MISSION",
                mission: "Our goal is to offer a high-quality curriculum that empowers students to gain both knowledge and skills.",
                vision: "Our aspiration is to witness the transformation of children into intelligent, ethical, and bilingual individuals capable of coexisting harmoniously with their peers.",
                hmUpdates: "Updates",
                hmEvent: "Events",
                hmCalendar: "School Calendar",
                statsTitle: "STUDENT STATISTICS",
                khProgram: "Khmer Education Program",
                IEProgram: "International English Program",
                ChineseClasses: "Chinese Language Classes",
                contact: "Contact",
                contactDesc: "With our highly dynamic and convenient website, you can contact us hassle-free. Just fill out the form below.",
                locationTitle: "Location:",
                locationDesc: "Prek Thmey Village, Prek Thmey Commune, Koh Thom District, Kandal Province.",
                EmailTitle: "Email:",
                PhoneTitle: "Call:",
                EmailName: "Your Name",
                EmailEmail: "Your Email",
                EmailSubject: "Subject",
                EmailMessage: "Message",
                send: "Send Message",
                homeNav: "Home",
                facultyNav: "Faculty",
                studentsNav: "Students",
                curriculumsNav: "Curriculums",
                contactUsNav: "Contact Us",
                enroll: "Enroll Now!",
                click: "(click here)",
                computer: "Computer",
                dayCare: "Day-care",
                regTitle: "Student registration form",
                firstName: "First name",
                lastName: "Last name",
                Age: "Age",
                bDay: "Birthday",
                gender: "Gender",
                male: "Male",
                female: "Female",
                address: "Address",
                next: "Next",
                parentsTitle: "Parent's Information",
                mother: "Mother's Name",
                father: "Father's Name",
                motherWork: "Mother's Occupation",
                fatherWork: "Father's Occupation",
                phone: "Phone Number",





            }
        },
        kh: {
            translation: {
                VisionTitle: "ចក្ខុវិស័យ",
                MissionTitle: "បេសកកម្ម",
                mission: "គោលបំណងរបស់យើងគឺផ្តល់ឱកាសដោយគ្រឹះសិក្សាដើម្បីទទួលបានចំណេះដឹងនិងជំនាន់ជាមួយគ្នាបានសម្របសម្រួល។",
                vision: "គោលការណ៍របស់យើងគឺគឺសង្គមទូទៅរវាងកូនក្នុងការប្តូរប្រកបដោយមនុស្សមួយចំនួនមានសិទ្ធិបន្ថែមនិងមនុស្សគ្រប់គ្នាទាន់ចូលរួមជាមួយគ្នាបានសម្របសម្រួល។",
                hmUpdates: "បច្ចុប្បន្នភាព",
                hmEvent: "ព្រឹត្តិការណ៍",
                hmCalendar: "ប្រតិទិនសាលា",
                statsTitle: "ស្ថិតិសិស្ស",
                khProgram: "កម្មវិធីអប់រំខ្មែរ",
                IEProgram: "កម្មវិធីភាសាអង់គ្លេសអន្តរជាតិ",
                ChineseClasses: "ថ្នាក់ភាសាចិន",
                GEProgram: "កម្មវិធីភាសាអង់គ្លេសទូទៅ",
                contact: "ទំនាក់ទំនង",
                contactDesc: "ជាមួយនឹងគេហទំព័រដែលមានថាមពល និងងាយស្រួលខ្ពស់របស់យើង អ្នកអាចទាក់ទងមកយើងដោយមិនមានការរំខាន។ គ្រាន់តែបំពេញទម្រង់ខាងក្រោម។",
                locationTitle: "ទីតាំង",
                locationDesc: " ភូមិព្រែកថ្មី ឃុំព្រែកថ្មី ស្រុកកោះធំ ខេត្តកណ្តាល",
                EmailTitle: "អ៊ីមែល៖",
                PhoneTitle: "ហៅទូរសព្ទ៖",
                EmailName: "ឈ្មោះ​របស់​អ្នក",
                EmailEmail: "អ៊ីមែល​របស់​អ្នក",
                EmailSubject: "ប្រធានបទ",
                EmailMessage: "សារ",
                send: "ផ្ញើ​សារ",
                homeNav: "ផ្ទះ",
                facultyNav: "គ្រូបង្រៀន",
                studentsNav: "សិស្ស",
                curriculumsNav: "កម្មវិធីសិក្សា",
                contactUsNav: "ទាក់ទង​មក​ពួក​យើង",
                enroll: "ចុះឈ្មោះ​ឥឡូវនេះ!",
                click: "(ចុច​ទីនេះ)",
                computer: "កុំព្យូទ័រ",
                dayCare: "ការថែទាំពេលថ្ងៃ",
                regTitle: "ទម្រង់ចុះឈ្មោះនិស្សិតងៃ",
                firstName: "ឈ្មោះដំបូង",
                lastName: "នាមត្រកូល",
                Age: "អាយុ",
                bDay: "ថ្ងៃកំណើត",
                gender: "ភេទ",
                male: "ប្រុស",
                female: "ស្រី",
                address: "អាស័យដ្ឋាន",
                next: "បន្ទាប់",
                parentsTitle: "ព័ត៌មានរបស់ឪពុកម្តាយ",
                mother: "ឈ្មោះម្តាយ",
                father: "ឈ្មោះ​ឪពុក",
                motherWork: "មុខរបររបស់ម្តាយ",
                fatherWork: "មុខរបររបស់ឪពុក",
                phone: "លេខទូរសព្ទ",

            }
        }
    }
}, function (err, t) {
    updateContent();
});

function updateContent() {
    const titleElements = document.querySelectorAll('.mission');
    const visionElements = document.querySelectorAll('.vision');
    const visionTitleElements = document.querySelectorAll('.VisionTitle');
    const missionTitleElements = document.querySelectorAll('.MissionTitle');
    const hmUpdatesElement = document.querySelectorAll('.hmUpdates');
    const hmEventElements = document.querySelectorAll('.hmEvent');
    const hmCalendarElements = document.querySelectorAll('.hmCalendar');
    const statsTitleElements = document.querySelectorAll('.stats-title');
    const khProgramElements = document.querySelectorAll('.curriculum-stat-khmer');
    const IEProgramElements = document.querySelectorAll('.curriculum-stat-IEP');
    const ChineseClassesElements = document.querySelectorAll('.curriculum-stat-Chinese');
    const GEProgramElements = document.querySelectorAll('.curriculum-stat-GEP');
    const contactElements = document.querySelectorAll('.contact-title');
    const contactDescriptionElements = document.querySelectorAll('.contact-description');
    const locationTitleElements = document.querySelectorAll('.location-title');
    const locationDescriptionElements = document.querySelectorAll('.location-description');
    const emailElements = document.querySelectorAll('.email-title');
    const phoneElements = document.querySelectorAll('.phone-title');
    const EmailNameElements = document.querySelectorAll('.email-name');
    const EmailEmailElements = document.querySelectorAll('.email-email');
    const EmailSubjectElements = document.querySelectorAll('.email-subject');
    const EmailMessageElements = document.querySelectorAll('.email-message');
    const sendElements = document.querySelectorAll('.send');


    const homeNavElements = document.querySelectorAll('.home-nav');
    const facultyNavElements = document.querySelectorAll('.faculty-nav');
    const studentsNavElements = document.querySelectorAll('.students-nav');
    const curriculumsNavElements = document.querySelectorAll('.curriculums-nav');
    const contactUsNavElements = document.querySelectorAll('.contactUs-nav');
    const enrollElements = document.querySelectorAll('.enroll');
    const clickElements = document.querySelectorAll('.click');


    const computerElements = document.querySelectorAll('.computer');
    const dayCareElements = document.querySelectorAll('.dayCare');


    const regTitleElements = document.querySelectorAll('.reg-title');
    const firstNameElements = document.querySelectorAll('.firstName');
    const lastNameElements = document.querySelectorAll('.lastName');
    const ageElements = document.querySelectorAll('.age');
    const bDayElements = document.querySelectorAll('.bday');
    const genderElements = document.querySelectorAll('.gender');
    const maleElements = document.querySelectorAll('.male');
    const femaleElements = document.querySelectorAll('.female');
    const addressElements = document.querySelectorAll('.address');
    const nextElements = document.querySelectorAll('.next');

    const parentTitleElements = document.querySelectorAll('.parents-title');
    const motherElements = document.querySelectorAll('.mother');
    const fatherElements = document.querySelectorAll('.father');
    const motherWorkElements = document.querySelectorAll('.mother-work');
    const fatherWorkElements = document.querySelectorAll('.father-work');
    const phoneNumberElements = document.querySelectorAll('.phoneNumber');


    titleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:mission');
    });

    visionElements.forEach(function (element) {
        element.textContent = i18next.t('translation:vision');
    });
    visionTitleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:VisionTitle');
    });
    missionTitleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:MissionTitle');
    });
    hmUpdatesElement.forEach(function (element) {
        element.textContent = i18next.t('translation:hmUpdates');
    });
    hmEventElements.forEach(function (element) {
        element.textContent = i18next.t('translation:hmEvent');
    });
    hmCalendarElements.forEach(function (element) {
        element.textContent = i18next.t('translation:hmCalendar');
    });
    statsTitleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:statsTitle');
    });
    khProgramElements.forEach(function (element) {
        element.textContent = i18next.t('translation:khProgram');
    });
    IEProgramElements.forEach(function (element) {
        element.textContent = i18next.t('translation:IEProgram');
    });
    ChineseClassesElements.forEach(function (element) {
        element.textContent = i18next.t('translation:ChineseClasses');
    });
    GEProgramElements.forEach(function (element) {
        element.textContent = i18next.t('translation:GEProgram');
    });
    contactElements.forEach(function (element) {
        element.textContent = i18next.t('translation:contact');
    });
    contactDescriptionElements.forEach(function (element) {
        element.textContent = i18next.t('translation:contactDesc');
    });
    locationTitleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:locationTitle');
    });
    locationDescriptionElements.forEach(function (element) {
        element.textContent = i18next.t('translation:locationDesc');
    });
    emailElements.forEach(function (element) {
        element.textContent = i18next.t('translation:EmailTitle');
    });
    phoneElements.forEach(function (element) {
        element.textContent = i18next.t('translation:PhoneTitle');
    });
    EmailNameElements.forEach(function (element) {
        element.textContent = i18next.t('translation:EmailName');
    });
    EmailEmailElements.forEach(function (element) {
        element.textContent = i18next.t('translation:EmailEmail');
    });
    EmailSubjectElements.forEach(function (element) {
        element.textContent = i18next.t('translation:EmailSubject');
    });
    EmailMessageElements.forEach(function (element) {
        element.textContent = i18next.t('translation:EmailMessage');
    });
    sendElements.forEach(function (element) {
        element.textContent = i18next.t('translation:send');
    });
    homeNavElements.forEach(function (element) {
        element.textContent = i18next.t('translation:homeNav');
    });
    facultyNavElements.forEach(function (element) {
        element.textContent = i18next.t('translation:facultyNav');
    });
    studentsNavElements.forEach(function (element) {
        element.textContent = i18next.t('translation:studentsNav');
    });
    curriculumsNavElements.forEach(function (element) {
        element.textContent = i18next.t('translation:curriculumsNav');
    });
    contactUsNavElements.forEach(function (element) {
        element.textContent = i18next.t('translation:contactUsNav');
    });
    enrollElements.forEach(function (element) {
        element.textContent = i18next.t('translation:enroll');
    });
    clickElements.forEach(function (element) {
        element.textContent = i18next.t('translation:click');
    });
    computerElements.forEach(function (element) {
        element.textContent = i18next.t('translation:computer');
    });
    dayCareElements.forEach(function (element) {
        element.textContent = i18next.t('translation:dayCare');
    });
    regTitleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:regTitle');
    });
    firstNameElements.forEach(function (element) {
        element.textContent = i18next.t('translation:firstName');
    });
    lastNameElements.forEach(function (element) {
        element.textContent = i18next.t('translation:lastName');
    });
    ageElements.forEach(function (element) {
        element.textContent = i18next.t('translation:Age');
    });
    bDayElements.forEach(function (element) {
        element.textContent = i18next.t('translation:bDay');
    });
    genderElements.forEach(function (element) {
        element.textContent = i18next.t('translation:gender');
    });
    maleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:male');
    });
    femaleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:female');
    });
    addressElements.forEach(function (element) {
        element.textContent = i18next.t('translation:address');
    });
    nextElements.forEach(function (element) {
        element.textContent = i18next.t('translation:next');
    });
    parentTitleElements.forEach(function (element) {
        element.textContent = i18next.t('translation:parentsTitle');
    });
    motherElements.forEach(function (element) {
        element.textContent = i18next.t('translation:mother');
    });
    fatherElements.forEach(function (element) {
        element.textContent = i18next.t('translation:father');
    });
    motherWorkElements.forEach(function (element) {
        element.textContent = i18next.t('translation:motherWork');
    });
    fatherWorkElements.forEach(function (element) {
        element.textContent = i18next.t('translation:fatherWork');
    });
    phoneNumberElements.forEach(function (element) {
        element.textContent = i18next.t('translation:phone');
    });

}


document.getElementById('toggle-switch').addEventListener('change', function () {
    const lang = this.checked ? 'kh' : 'en'; // Use 'kh' if checked, otherwise 'en'
    i18next.changeLanguage(lang, function (err, t) {
        if (err) return console.error('Something went wrong loading the language', err);
        updateContent(); // Update content after changing language

        localStorage.setItem('selectedLanguage', lang);
    });
});

const storedLang = localStorage.getItem('selectedLanguage');

// If a language is stored, apply it
if (storedLang) {
    i18next.changeLanguage(storedLang, function (err, t) {
        if (err) return console.error('Something went wrong loading the language', err);
        updateContent();

        // Set the toggle switch state based on the stored language
        const toggleSwitch = document.getElementById('toggle-switch');
        toggleSwitch.checked = storedLang === 'kh'; // Set to true if 'kh', false if 'en'
    });
}