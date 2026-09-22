/* =========================================================
   HTCampusBot - ADMIN SYSTEM
   Task 6 + Task 7
   Complete admin.js
   ========================================================= */


/* =========================================================
   CONSTANTS
   ========================================================= */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const PSGC_API =
    "https://psgc.cloud/api/v2";

const USERS_STORAGE_KEY =
    "htcampusTask5Users";

const PRIVILEGES_STORAGE_KEY =
    "htcampusUserPrivileges";

const ADMIN_SESSION_KEY =
    "htcampusAdminLoggedIn";

const ADMIN_REMEMBER_KEY =
    "htcampusAdminRemember";


/* Task 8: currently edited registered user */
let editingUserId = null;


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function getValue(id) {

    const element =
        getElement(id);

    return element
        ? element.value.trim()
        : "";
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function todayISO() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function setMessage(
    id,
    text,
    type = ""
) {

    const element =
        getElement(id);

    if (!element) {
        return;
    }

    if (type) {

        element.className =
            `form-message validation-summary ${type}`;

    } else {

        element.className =
            "form-message";
    }

    element.innerHTML =
        text || "";
}


/* =========================================================
   TASK 6 VALIDATION STYLES
   ========================================================= */

(function addValidationStyles() {

    if (
        getElement(
            "task6ValidationStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );

    style.id =
        "task6ValidationStyles";


    style.textContent = `

        .validation-message {
            display: block;
            min-height: 18px;
            margin-top: 6px;
            font-size: 12px;
            font-weight: 500;
            line-height: 1.35;
        }

        .validation-message.error {
            color: #d93025;
        }

        .validation-message.success {
            color: #168a45;
        }

        input.validation-invalid,
        select.validation-invalid {
            border-color: #d93025 !important;
            background: #fff8f8 !important;
            box-shadow:
                0 0 0 3px
                rgba(217, 48, 37, 0.08) !important;
        }

        input.validation-valid,
        select.validation-valid {
            border-color: #1b9b52 !important;
            background: #f8fffb !important;
            box-shadow:
                0 0 0 3px
                rgba(27, 155, 82, 0.07) !important;
        }

        .login-invalid {
            border-color: #d93025 !important;
        }

        .action-buttons {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            white-space: nowrap;
        }

        .action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-height: 36px;
            padding: 8px 13px;
            border-radius: 8px;
            border: 1px solid transparent;
            font-family: inherit;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s ease;
        }

        .action-btn.delete {
            color: #c62828;
            background: #fff4f4;
            border-color: #efbcbc;
        }

        .action-btn.delete:hover {
            color: #ffffff;
            background: #c62828;
        }

        .action-btn.edit {
            color: #087b22;
            background: #e8f7ed;
            border-color: #b9dfc4;
        }

        .action-btn.edit:hover {
            color: #ffffff;
            background: #087b22;
        }

        .empty-users,
        .privilege-empty-row {
            text-align: center;
            padding: 35px 20px !important;
            color: #777;
        }

        .empty-users i,
        .privilege-empty-row i {
            display: block;
            margin-bottom: 10px;
            font-size: 28px;
            color: #8ab89d;
        }

        .empty-users strong,
        .privilege-empty-row strong {
            display: block;
            margin-bottom: 5px;
            color: #315c43;
        }

        .privilege-action-buttons {
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
        }

        .privilege-action-button {
            min-height: 32px;
            padding: 7px 10px;
            border-radius: 7px;
            border: 1px solid transparent;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s ease;
        }

        .privilege-action-button.edit {
            color: #087b22;
            background: #e8f7ed;
            border-color: #b9dfc4;
        }

        .privilege-action-button.edit:hover {
            color: #ffffff;
            background: #087b22;
        }

        .privilege-action-button.delete {
            color: #c62828;
            background: #fff1f1;
            border-color: #efbcbc;
        }

        .privilege-action-button.delete:hover {
            color: #ffffff;
            background: #c62828;
        }

        .privilege-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        .privilege-badge {
            display: inline-block;
            padding: 4px 7px;
            border-radius: 14px;
            background: #e7f7eb;
            color: #087b22;
            font-size: 10px;
            font-weight: 700;
        }

        .no-permission-badge {
            background: #f1f1f1;
            color: #777;
        }

        .privilege-user-name {
            display: block;
            font-weight: 600;
        }

        .privilege-user-email {
            display: block;
            margin-top: 2px;
            color: #849087;
            font-size: 10px;
        }

        .privilege-expiration {
            color: #38513f;
            font-size: 11px;
            font-weight: 600;
        }

        .privilege-expiration.no-expiration {
            color: #888;
        }

        .privilege-updated {
            color: #6e7c73;
            font-size: 10px;
        }

        @media (max-width: 900px) {

            .action-buttons,
            .privilege-action-buttons {
                flex-direction: column;
                align-items: stretch;
            }

            .action-btn,
            .privilege-action-button {
                width: 100%;
            }
        }
    `;


    document.head.appendChild(
        style
    );

})();


/* =========================================================
   VALIDATION HELPERS
   ========================================================= */

function getValidationMessage(
    element
) {

    if (!element) {
        return null;
    }


    const group =
        element.closest(
            ".form-group"
        );


    if (!group) {
        return null;
    }


    let message =
        group.querySelector(
            `.validation-message[data-for="${element.id}"]`
        );


    if (!message) {

        message =
            document.createElement(
                "small"
            );

        message.className =
            "validation-message";

        message.dataset.for =
            element.id;

        message.setAttribute(
            "aria-live",
            "polite"
        );

        group.appendChild(
            message
        );
    }


    return message;
}


function setFieldError(
    element,
    message
) {

    if (!element) {
        return false;
    }


    element.classList.remove(
        "validation-valid"
    );

    element.classList.add(
        "validation-invalid"
    );


    const error =
        getValidationMessage(
            element
        );


    if (error) {

        error.className =
            "validation-message error";

        error.innerHTML =
            `<i class="fa-solid fa-circle-exclamation"></i> ${escapeHTML(message)}`;
    }


    return false;
}


function setFieldSuccess(
    element
) {

    if (!element) {
        return true;
    }


    element.classList.remove(
        "validation-invalid"
    );

    element.classList.add(
        "validation-valid"
    );


    const message =
        getValidationMessage(
            element
        );


    if (message) {

        message.className =
            "validation-message";

        message.textContent =
            "";
    }


    return true;
}


function clearFieldValidation(
    element
) {

    if (!element) {
        return;
    }


    element.classList.remove(
        "validation-invalid",
        "validation-valid"
    );


    const message =
        getValidationMessage(
            element
        );


    if (message) {

        message.className =
            "validation-message";

        message.textContent =
            "";
    }
}


/* =========================================================
   BASIC VALIDATION
   ========================================================= */

function validateSelect(
    id,
    message
) {

    const element =
        getElement(id);


    if (!element) {
        return true;
    }


    if (!element.value) {

        return setFieldError(
            element,
            message
        );
    }


    return setFieldSuccess(
        element
    );
}


function validateName(
    id,
    label
) {

    const element =
        getElement(id);


    if (!element) {
        return true;
    }


    const value =
        element.value.trim();


    if (!value) {

        return setFieldError(
            element,
            `${label} is required.`
        );
    }


    if (value.length < 2) {

        return setFieldError(
            element,
            `${label} must contain at least 2 characters.`
        );
    }


    if (value.length > 50) {

        return setFieldError(
            element,
            `${label} must not exceed 50 characters.`
        );
    }


    if (
        !/^[A-Za-zÀ-ÖØ-öø-ÿÑñ' -]+$/.test(
            value
        )
    ) {

        return setFieldError(
            element,
            `${label} can only contain letters, spaces, apostrophes, or hyphens.`
        );
    }


    return setFieldSuccess(
        element
    );
}


function validateEmail() {

    const element =
        getElement("email");


    if (!element) {
        return true;
    }


    if (!element.value.trim()) {

        return setFieldError(
            element,
            "Email address is required."
        );
    }


    if (
        !element.validity.valid
    ) {

        return setFieldError(
            element,
            "Please enter a valid email address."
        );
    }


    return setFieldSuccess(
        element
    );
}


function validatePassword() {

    const element =
        getElement(
            "initialPassword"
        );


    if (!element) {
        return true;
    }


    if (!element.value) {

        return setFieldError(
            element,
            "Initial password is required."
        );
    }


    if (
        element.value.length < 8
    ) {

        return setFieldError(
            element,
            "Password must contain at least 8 characters."
        );
    }


    if (
        element.value.length > 50
    ) {

        return setFieldError(
            element,
            "Password must not exceed 50 characters."
        );
    }


    return setFieldSuccess(
        element
    );
}


function validatePostalCode() {

    const element =
        getElement(
            "postalCode"
        );


    if (!element) {
        return true;
    }


    const value =
        element.value.trim();


    if (!value) {

        return setFieldError(
            element,
            "Postal code is required."
        );
    }


    if (
        !/^\d{4}$/.test(value)
    ) {

        return setFieldError(
            element,
            "Postal code must contain exactly 4 digits."
        );
    }


    return setFieldSuccess(
        element
    );
}


function validateHouseUnit() {

    const element =
        getElement(
            "houseUnit"
        );


    if (!element) {
        return true;
    }


    const value =
        element.value.trim();


    if (!value) {

        return setFieldError(
            element,
            "House / Unit No. is required."
        );
    }


    return setFieldSuccess(
        element
    );
}


function validateStreet() {

    const element =
        getElement(
            "street"
        );


    if (!element) {
        return true;
    }


    const value =
        element.value.trim();


    if (!value) {

        return setFieldError(
            element,
            "Street / Subdivision is required."
        );
    }


    if (value.length < 2) {

        return setFieldError(
            element,
            "Street / Subdivision must contain at least 2 characters."
        );
    }


    return setFieldSuccess(
        element
    );
}


/* =========================================================
   BIRTHDATE VALIDATION
   ========================================================= */

function validateBirthdate() {

    const month =
        getElement(
            "birthMonth"
        );

    const day =
        getElement(
            "birthDay"
        );

    const year =
        getElement(
            "birthYear"
        );


    if (
        !month ||
        !day ||
        !year
    ) {
        return true;
    }


    let valid =
        true;


    if (!month.value) {

        setFieldError(
            month,
            "Please select the birth month."
        );

        valid = false;
    }


    if (!day.value) {

        setFieldError(
            day,
            "Please select the birth day."
        );

        valid = false;
    }


    if (!year.value) {

        setFieldError(
            year,
            "Please select the birth year."
        );

        valid = false;
    }


    if (!valid) {
        return false;
    }


    const date =
        new Date(
            Number(year.value),
            Number(month.value) - 1,
            Number(day.value)
        );


    if (
        date.getFullYear() !==
            Number(year.value) ||
        date.getMonth() !==
            Number(month.value) - 1 ||
        date.getDate() !==
            Number(day.value)
    ) {

        setFieldError(
            day,
            "The selected birthdate is not valid."
        );

        return false;
    }


    setFieldSuccess(month);
    setFieldSuccess(day);
    setFieldSuccess(year);


    return true;
}


/* =========================================================
   ADD USER VALIDATION
   ========================================================= */

function validateAddUserForm() {

    let valid =
        true;


    [
        "firstName",
        "middleName",
        "lastName",
        "birthMonth",
        "birthDay",
        "birthYear",
        "email",
        "department",
        "country",
        "province",
        "cityMunicipality",
        "barangay",
        "houseUnit",
        "street",
        "postalCode",
        "initialRole",
        "initialPassword"
    ]
    .forEach(
        id =>
            clearFieldValidation(
                getElement(id)
            )
    );


    /* FIRST NAME */

    if (
        !validateName(
            "firstName",
            "First Name"
        )
    ) {
        valid = false;
    }


    /* MIDDLE NAME - OPTIONAL */

    const middleName =
        getElement(
            "middleName"
        );


    if (
        middleName &&
        middleName.value.trim()
    ) {

        const value =
            middleName.value.trim();


        if (
            value.length < 2 ||
            !/^[A-Za-zÀ-ÖØ-öø-ÿÑñ' -]+$/.test(
                value
            )
        ) {

            setFieldError(
                middleName,
                "Middle Name contains invalid characters."
            );

            valid = false;

        } else {

            setFieldSuccess(
                middleName
            );
        }
    }


    /* LAST NAME */

    if (
        !validateName(
            "lastName",
            "Last Name"
        )
    ) {
        valid = false;
    }


    /* BIRTHDATE */

    if (
        !validateBirthdate()
    ) {
        valid = false;
    }


    /* EMAIL */

    if (
        !validateEmail()
    ) {
        valid = false;
    }


    /* DEPARTMENT */

    if (
        !validateSelect(
            "department",
            "Please select a department."
        )
    ) {
        valid = false;
    }


    /* ADDRESS */

    if (
        !validateSelect(
            "country",
            "Please select a country."
        )
    ) {
        valid = false;
    }


    if (
        !validateSelect(
            "province",
            "Please select a province."
        )
    ) {
        valid = false;
    }


    if (
        !validateSelect(
            "cityMunicipality",
            "Please select a city or municipality."
        )
    ) {
        valid = false;
    }


    if (
        !validateSelect(
            "barangay",
            "Please select a barangay."
        )
    ) {
        valid = false;
    }


    if (
        !validateHouseUnit()
    ) {
        valid = false;
    }


    if (
        !validateStreet()
    ) {
        valid = false;
    }


    if (
        !validatePostalCode()
    ) {
        valid = false;
    }


    /* ACCOUNT */

    if (
        !validateSelect(
            "initialRole",
            "Please select an initial role."
        )
    ) {
        valid = false;
    }


    if (
        !validatePassword()
    ) {
        valid = false;
    }


    if (!valid) {

        setMessage(
            "addUserMessage",

            `<i class="fa-solid fa-circle-exclamation"></i>
             Please correct the highlighted fields before creating the account.`,

            "error"
        );

    } else {

        setMessage(
            "addUserMessage",
            ""
        );
    }


    return valid;
}


/* =========================================================
   LIVE VALIDATION
   ========================================================= */

function attachAddUserLiveValidation() {

    const fields = [
        "firstName",
        "middleName",
        "lastName",
        "email",
        "houseUnit",
        "street",
        "postalCode",
        "initialPassword"
    ];


    fields.forEach(
        id => {

            const element =
                getElement(id);


            if (!element) {
                return;
            }


            element.addEventListener(
                "blur",
                function () {

                    if (
                        id ===
                        "firstName"
                    ) {

                        validateName(
                            id,
                            "First Name"
                        );

                    } else if (
                        id ===
                        "middleName"
                    ) {

                        if (
                            !this.value.trim()
                        ) {

                            clearFieldValidation(
                                this
                            );

                        } else {

                            const value =
                                this.value.trim();


                            if (
                                value.length < 2 ||
                                !/^[A-Za-zÀ-ÖØ-öø-ÿÑñ' -]+$/.test(
                                    value
                                )
                            ) {

                                setFieldError(
                                    this,
                                    "Middle Name contains invalid characters."
                                );

                            } else {

                                setFieldSuccess(
                                    this
                                );
                            }
                        }

                    } else if (
                        id ===
                        "lastName"
                    ) {

                        validateName(
                            id,
                            "Last Name"
                        );

                    } else if (
                        id ===
                        "email"
                    ) {

                        validateEmail();

                    } else if (
                        id ===
                        "houseUnit"
                    ) {

                        validateHouseUnit();

                    } else if (
                        id ===
                        "street"
                    ) {

                        validateStreet();

                    } else if (
                        id ===
                        "postalCode"
                    ) {

                        validatePostalCode();

                    } else if (
                        id ===
                        "initialPassword"
                    ) {

                        validatePassword();
                    }
                }
            );
        }
    );


    [
        "birthMonth",
        "birthDay",
        "birthYear",
        "department",
        "country",
        "province",
        "cityMunicipality",
        "barangay",
        "initialRole"
    ]
    .forEach(
        id => {

            const element =
                getElement(id);


            if (!element) {
                return;
            }


            element.addEventListener(
                "change",
                function () {

                    if (
                        id ===
                            "birthMonth" ||
                        id ===
                            "birthDay" ||
                        id ===
                            "birthYear"
                    ) {

                        validateBirthdate();

                    } else {

                        if (
                            this.value
                        ) {

                            setFieldSuccess(
                                this
                            );

                        } else {

                            setFieldError(
                                this,
                                "Please select an option."
                            );
                        }
                    }
                }
            );
        }
    );
}


/* =========================================================
   PHILIPPINES LOCATION DROPDOWNS
   ========================================================= */

async function fetchJSON(
    url
) {

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `Request failed: ${response.status}`
        );
    }


    return response.json();
}


function getAPIArray(
    data
) {

    if (
        Array.isArray(data)
    ) {
        return data;
    }


    if (
        data &&
        Array.isArray(
            data.data
        )
    ) {
        return data.data;
    }


    if (
        data &&
        Array.isArray(
            data.results
        )
    ) {
        return data.results;
    }


    return [];
}


function addOption(
    select,
    value,
    text
) {

    const option =
        document.createElement(
            "option"
        );


    option.value =
        value;

    option.textContent =
        text;


    select.appendChild(
        option
    );
}


function setLoading(
    select,
    text
) {

    if (!select) {
        return;
    }


    select.innerHTML =
        "";


    addOption(
        select,
        "",
        text
    );


    select.disabled =
        true;
}


function cityName(
    name
) {

    return String(
        name || ""
    )
    .replace(
        /^City of (.+)$/i,
        "$1 City"
    );
}


async function loadCities(
    province
) {

    const city =
        getElement(
            "cityMunicipality"
        );

    const barangay =
        getElement(
            "barangay"
        );


    if (
        !city ||
        !barangay
    ) {
        return;
    }


    setLoading(
        city,
        "Loading cities / municipalities..."
    );


    setLoading(
        barangay,
        "Select City / Municipality first"
    );


    try {

        const data =
            await fetchJSON(
                `${PSGC_API}/provinces/${encodeURIComponent(province)}/cities-municipalities`
            );


        const list =
            getAPIArray(
                data
            );


        list.sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        );


        city.innerHTML =
            "";


        addOption(
            city,
            "",
            "Select City / Municipality"
        );


        list.forEach(
            item => {

                addOption(
                    city,
                    item.code ||
                        item.name,
                    cityName(
                        item.name
                    )
                );
            }
        );


        city.disabled =
            false;


    } catch (error) {

        console.error(
            "Unable to load cities:",
            error
        );


        city.innerHTML =
            "";


        addOption(
            city,
            "",
            "Unable to load cities / municipalities"
        );


        city.disabled =
            true;


        barangay.innerHTML =
            "";


        addOption(
            barangay,
            "",
            "Location data unavailable"
        );


        barangay.disabled =
            true;
    }
}


async function loadBarangays(
    cityCode
) {

    const barangay =
        getElement(
            "barangay"
        );


    if (!barangay) {
        return;
    }


    setLoading(
        barangay,
        "Loading barangays..."
    );


    try {

        const data =
            await fetchJSON(
                `${PSGC_API}/cities-municipalities/${encodeURIComponent(cityCode)}/barangays`
            );


        const list =
            getAPIArray(
                data
            );


        list.sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        );


        barangay.innerHTML =
            "";


        addOption(
            barangay,
            "",
            "Select Barangay"
        );


        list.forEach(
            item => {

                addOption(
                    barangay,
                    item.code ||
                        item.name,
                    item.name
                );
            }
        );


        barangay.disabled =
            false;


    } catch (error) {

        console.error(
            "Unable to load barangays:",
            error
        );


        barangay.innerHTML =
            "";


        addOption(
            barangay,
            "",
            "Unable to load barangays"
        );


        barangay.disabled =
            true;
    }
}


function setupLocationDropdowns() {

    const province =
        getElement(
            "province"
        );

    const city =
        getElement(
            "cityMunicipality"
        );

    const barangay =
        getElement(
            "barangay"
        );


    if (
        !province ||
        !city ||
        !barangay
    ) {
        return;
    }


    city.disabled =
        true;

    barangay.disabled =
        true;


    province.addEventListener(
        "change",
        async function () {

            clearFieldValidation(
                province
            );


            city.innerHTML =
                "";


            barangay.innerHTML =
                "";


            if (
                !province.value
            ) {

                addOption(
                    city,
                    "",
                    "Select City / Municipality"
                );

                addOption(
                    barangay,
                    "",
                    "Select Barangay"
                );

                city.disabled =
                    true;

                barangay.disabled =
                    true;

                return;
            }


            setFieldSuccess(
                province
            );


            await loadCities(
                province.value
            );
        }
    );


    city.addEventListener(
        "change",
        async function () {

            clearFieldValidation(
                city
            );


            barangay.innerHTML =
                "";


            if (
                !city.value
            ) {

                addOption(
                    barangay,
                    "",
                    "Select Barangay"
                );

                barangay.disabled =
                    true;

                return;
            }


            setFieldSuccess(
                city
            );


            await loadBarangays(
                city.value
            );
        }
    );
}


/* =========================================================
   BIRTHDATE DROPDOWNS
   ========================================================= */

function setupBirthdateDropdowns() {

    const month =
        getElement(
            "birthMonth"
        );

    const day =
        getElement(
            "birthDay"
        );

    const year =
        getElement(
            "birthYear"
        );


    if (
        !month ||
        !day ||
        !year
    ) {
        return;
    }


    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    month.innerHTML =
        `<option value="">Month</option>`;


    months.forEach(
        (name, index) => {

            addOption(
                month,
                index + 1,
                name
            );
        }
    );


    const currentYear =
        new Date()
            .getFullYear();


    year.innerHTML =
        `<option value="">Year</option>`;


    for (
        let current =
            currentYear;

        current >=
            currentYear - 100;

        current--
    ) {

        addOption(
            year,
            current,
            current
        );
    }


    function updateDays() {

        const selectedMonth =
            Number(
                month.value
            );


        const selectedYear =
            Number(
                year.value
            ) || 2024;


        const previousDay =
            day.value;


        day.innerHTML =
            `<option value="">Day</option>`;


        if (
            !selectedMonth
        ) {
            return;
        }


        const days =
            new Date(
                selectedYear,
                selectedMonth,
                0
            ).getDate();


        for (
            let current = 1;
            current <= days;
            current++
        ) {

            addOption(
                day,
                current,
                current
            );
        }


        if (
            previousDay &&
            Number(previousDay) <= days
        ) {

            day.value =
                previousDay;
        }
    }


    month.addEventListener(
        "change",
        updateDays
    );


    year.addEventListener(
        "change",
        updateDays
    );


    updateDays();
}


/* =========================================================
   USER STORAGE
   ========================================================= */

function getUsers() {

    try {

        const saved =
            localStorage.getItem(
                USERS_STORAGE_KEY
            );


        const users =
            saved
                ? JSON.parse(saved)
                : [];


        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        console.error(
            "Unable to read users:",
            error
        );

        return [];
    }
}


function saveUsers(
    users
) {

    localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(users)
    );
}


function generateUserID() {

    return (
        "USR-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );
}


/* =========================================================
   REGISTERED USERS TABLE
   ========================================================= */

function loadUsers() {

    const tableBody =
        getElement(
            "usersTableBody"
        );

    const accountCount =
        getElement(
            "accountCount"
        );


    if (!tableBody) {
        return;
    }


    const users =
        getUsers();


    if (accountCount) {

        accountCount.textContent =
            `${users.length} ${
                users.length === 1
                    ? "Account"
                    : "Accounts"
            }`;
    }


    if (
        users.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-users"
                >

                    <i
                        class="fa-solid fa-users-slash"
                    ></i>

                    <strong>
                        No registered users
                    </strong>

                    <span>
                        Create a new account using
                        the Add New User button.
                    </span>

                </td>

            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        "";


    users.forEach(
        user => {

            const fullName =
                user.fullName ||
                [
                    user.firstName,
                    user.middleName,
                    user.lastName
                ]
                .filter(Boolean)
                .join(" ");


            const userId =
                user.userId ||
                user.id ||
                "";


            const row =
                document.createElement(
                    "tr"
                );


            /*
             * IMPORTANT:
             * Manage Access has been removed.
             * Registered Users now has only Delete.
             */

            row.innerHTML = `

                <td>

                    <span
                        class="user-id-text"
                    >
                        ${escapeHTML(userId)}
                    </span>

                </td>


                <td>
                    ${escapeHTML(
                        fullName || "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        user.email || "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        user.department || "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        user.role || "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        user.status || "Active"
                    )}
                </td>


                <td>

                    <div
                        class="action-buttons"
                    >

                        <button
                            type="button"
                            class="action-btn edit"
                            data-action="edit"
                            data-user-id="${escapeHTML(userId)}"
                            title="Edit this user"
                        >

                            <i
                                class="fa-solid fa-pen-to-square"
                            ></i>

                            Edit

                        </button>

                        <button
                            type="button"
                            class="action-btn delete"
                            data-action="delete"
                            data-user-id="${escapeHTML(userId)}"
                            title="Delete this user"
                        >

                            <i
                                class="fa-solid fa-trash-can"
                            ></i>

                            Delete

                        </button>

                    </div>

                </td>
            `;


            tableBody.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   ADD NEW USER
   ========================================================= */

function resetAddUserFormFields() {

    const form = getElement("addUserForm");
    if (form) form.reset();

    ["firstName","middleName","lastName","birthMonth","birthDay","birthYear","email","department","country","province","cityMunicipality","barangay","houseUnit","street","postalCode","initialRole","initialPassword"]
        .forEach(id => clearFieldValidation(getElement(id)));

    const city = getElement("cityMunicipality");
    const barangay = getElement("barangay");

    if (city) {
        city.innerHTML = `<option value="">Select City / Municipality</option>`;
        city.disabled = true;
    }

    if (barangay) {
        barangay.innerHTML = `<option value="">Select Barangay</option>`;
        barangay.disabled = true;
    }

    setMessage("addUserMessage", "");

    /* =====================================================
       RESTORE ADD USER INTERFACE
       ===================================================== */

    const addUserTitle =
        document.querySelector(
            "#addUserPage h2"
        );

    const addUserSubmitButton =
        document.querySelector(
            "#addUserForm button[type='submit']"
        );

    if (addUserTitle) {
        addUserTitle.textContent =
            "Add New User";
    }

    if (addUserSubmitButton) {
        addUserSubmitButton.innerHTML =
            '<i class="fa-solid fa-user-plus"></i> Add User';
    }
}


/* =========================================================
   TASK 8 - EDIT REGISTERED USER
   ========================================================= */

async function startEditUser(userId) {

    const user = getUsers().find(item => (item.userId || item.id) === userId);
    if (!user) return;

    editingUserId = userId;

    /* =====================================================
       CHANGE FORM TO EDIT MODE
       ===================================================== */

    const addUserTitle =
        document.querySelector(
            "#addUserPage h2"
        );

    const addUserSubmitButton =
        document.querySelector(
            "#addUserForm button[type='submit']"
        );

    if (addUserTitle) {
        addUserTitle.textContent =
            "Edit User Information";
    }

    if (addUserSubmitButton) {
        addUserSubmitButton.innerHTML =
            '<i class="fa-solid fa-pen-to-square"></i> Update User';
    }

    const setValue = (id, value) => {
        const element = getElement(id);
        if (element) element.value = value ?? "";
    };

    setValue("firstName", user.firstName);
    setValue("middleName", user.middleName);
    setValue("lastName", user.lastName);
    setValue("birthMonth", user.birthMonth);
    setValue("birthYear", user.birthYear);

    const month = getElement("birthMonth");
    const year = getElement("birthYear");
    const day = getElement("birthDay");
    if (month && year) {
        month.dispatchEvent(new Event("change"));
        year.dispatchEvent(new Event("change"));
    }
    if (day) day.value = user.birthDay ?? "";

    setValue("email", user.email);
    setValue("department", user.department);
    setValue("country", user.country);
    setValue("houseUnit", user.houseUnit);
    setValue("street", user.street);
    setValue("postalCode", user.postalCode);
    setValue("initialRole", user.role);

    const password = getElement("initialPassword");
    if (password) password.value = user.password || "";

    const province = getElement("province");
    const city = getElement("cityMunicipality");
    const barangay = getElement("barangay");

    if (province) province.value = user.province || "";

    showPage("addUserPage");

    if (province && province.value) {
        await loadCities(province.value);
        if (city) city.value = user.cityMunicipality || "";
        if (city && city.value) {
            await loadBarangays(city.value);
            if (barangay) barangay.value = user.barangay || "";
        }
    }

    ["firstName","middleName","lastName","birthMonth","birthDay","birthYear","email","department","country","province","cityMunicipality","barangay","houseUnit","street","postalCode","initialRole","initialPassword"]
        .forEach(id => clearFieldValidation(getElement(id)));

    setMessage(
        "addUserMessage",
        `<i class="fa-solid fa-pen-to-square"></i> Editing User ID: ${escapeHTML(userId)}`,
        "success"
    );
}


function setupAddUserForm() {

    const form = getElement("addUserForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!validateAddUserForm()) return;

        const firstName = getValue("firstName");
        const middleName = getValue("middleName");
        const lastName = getValue("lastName");
        const passwordElement = getElement("initialPassword");

        const userData = {
            firstName,
            middleName,
            lastName,
            fullName: [firstName, middleName, lastName].filter(Boolean).join(" "),
            birthMonth: getValue("birthMonth"),
            birthDay: getValue("birthDay"),
            birthYear: getValue("birthYear"),
            email: getValue("email"),
            department: getValue("department"),
            country: getValue("country"),
            province: getValue("province"),
            cityMunicipality: getValue("cityMunicipality"),
            barangay: getValue("barangay"),
            houseUnit: getValue("houseUnit"),
            street: getValue("street"),
            postalCode: getValue("postalCode"),
            role: getValue("initialRole"),
            password: passwordElement ? passwordElement.value : "",
            status: "Active"
        };

        const users = getUsers();

        if (editingUserId) {

            const existingUser = users.find(item => (item.userId || item.id) === editingUserId);

            if (!existingUser) {
                editingUserId = null;
                setMessage("addUserMessage", `<i class="fa-solid fa-circle-exclamation"></i> The selected user could not be found.`, "error");
                return;
            }

            const updatedUser = {
                ...existingUser,
                ...userData,
                userId: existingUser.userId || editingUserId,
                createdAt: existingUser.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            saveUsers(users.map(item =>
                (item.userId || item.id) === editingUserId ? updatedUser : item
            ));

            loadUsers();
            loadPrivilegeUsers();
            loadPrivilegeRecords();

            const updatedId = editingUserId;
            editingUserId = null;
            resetAddUserFormFields();
            showAccountCreatedModal(updatedId, true);
            return;
        }

        const user = {
            userId: generateUserID(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        users.push(user);
        saveUsers(users);
        loadUsers();
        loadPrivilegeUsers();
        resetAddUserFormFields();
        showAccountCreatedModal(user.userId, false);
    });
}

/* =========================================================
   ACCOUNT CREATED SUCCESS POPUP
   ========================================================= */

function addAccountCreatedModalStyles() {

    if (
        getElement(
            "accountCreatedModalStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "accountCreatedModalStyles";


    style.textContent = `

        .account-created-overlay {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background:
                rgba(
                    14,
                    38,
                    23,
                    0.45
                );

            backdrop-filter:
                blur(3px);
        }


        .account-created-modal {

            width:
                min(
                    420px,
                    100%
                );

            padding:
                30px
                28px
                26px;

            border-radius:
                16px;

            background:
                #ffffff;

            border:
                1px solid
                #dcebe1;

            box-shadow:
                0 20px 55px
                rgba(
                    0,
                    0,
                    0,
                    0.18
                );

            text-align:
                center;

            animation:
                accountCreatedModalIn
                0.2s
                ease-out;
        }


        .account-created-icon {

            width:
                64px;

            height:
                64px;

            margin:
                0 auto
                16px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border-radius:
                50%;

            background:
                #e5f7eb;

            color:
                #087b3b;

            font-size:
                28px;
        }


        .account-created-modal h3 {

            margin:
                0 0 8px;

            color:
                #0b5b2a;

            font-size:
                20px;

            font-weight:
                700;
        }


        .account-created-modal p {

            margin:
                0;

            color:
                #68766e;

            font-size:
                13px;

            line-height:
                1.6;
        }


        .account-created-user-id {

            display:
                inline-block;

            margin-top:
                10px;

            padding:
                6px
                10px;

            border-radius:
                7px;

            background:
                #eef8f1;

            color:
                #087b3b;

            font-size:
                12px;

            font-weight:
                700;
        }


        .account-created-ok {

            width:
                100%;

            margin-top:
                22px;

            min-height:
                42px;

            border:
                0;

            border-radius:
                9px;

            background:
                #087b3b;

            color:
                #ffffff;

            font-family:
                inherit;

            font-size:
                13px;

            font-weight:
                700;

            cursor:
                pointer;

            transition:
                0.2s ease;
        }


        .account-created-ok:hover {

            background:
                #05682f;

            transform:
                translateY(-1px);
        }


        @keyframes accountCreatedModalIn {

            from {

                opacity:
                    0;

                transform:
                    translateY(8px)
                    scale(0.98);
            }

            to {

                opacity:
                    1;

                transform:
                    translateY(0)
                    scale(1);
            }
        }
    `;


    document.head.appendChild(
        style
    );
}


function showAccountCreatedModal(
    userId,
    isUpdate = false
) {

    addAccountCreatedModalStyles();


    const oldModal =
        getElement(
            "accountCreatedOverlay"
        );


    if (oldModal) {
        oldModal.remove();
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "accountCreatedOverlay";


    overlay.className =
        "account-created-overlay";


    overlay.setAttribute(
        "role",
        "dialog"
    );


    overlay.setAttribute(
        "aria-modal",
        "true"
    );


    overlay.setAttribute(
        "aria-labelledby",
        "accountCreatedTitle"
    );


    overlay.innerHTML = `

        <div
            class="account-created-modal"
        >

            <div
                class="account-created-icon"
            >

                <i
                    class="fa-solid fa-circle-check"
                ></i>

            </div>


            <h3
                id="accountCreatedTitle"
            >
                ${isUpdate ? "Account Updated Successfully" : "Account Created Successfully"}
            </h3>


            <p>
                ${isUpdate ? "The user account has been successfully updated in the system." : "The user account has been successfully saved to the system."}
            </p>


            <span
                class="account-created-user-id"
            >
                User ID:
                ${escapeHTML(userId)}
            </span>


            <button
                type="button"
                class="account-created-ok"
                id="accountCreatedOk"
            >
                OK
            </button>

        </div>
    `;


    document.body.appendChild(
        overlay
    );


    const okButton =
        getElement(
            "accountCreatedOk"
        );


    if (okButton) {

        okButton.addEventListener(
            "click",
            function () {

                /*
                 * Close popup.
                 */

                overlay.remove();


                /*
                 * Return to User Access home.
                 */

                showPage(
                    "userAccessPage"
                );


                /*
                 * Refresh both tables.
                 */

                loadUsers();

                loadPrivilegeRecords();
            }
        );


        okButton.focus();
    }
}


/* =========================================================
   DELETE USER CONFIRMATION POPUP
   ========================================================= */

(function addDeleteConfirmationStyles() {

    if (document.getElementById("deleteConfirmationStyles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "deleteConfirmationStyles";

    style.textContent = `
        /* ================================================
           DELETE CONFIRMATION MODAL
           ================================================ */

        .delete-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(20, 35, 27, 0.55);
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
            animation: deleteModalFadeIn 0.18s ease;
        }


        .delete-modal {
            width: min(430px, 100%);
            background: #ffffff;
            border-radius: 16px;
            padding: 28px;
            text-align: center;
            box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
            border: 1px solid #e6eee9;
            animation: deleteModalScaleIn 0.2s ease;
        }


        .delete-modal-icon {
            width: 58px;
            height: 58px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: #c62828;
            background: #fff1f1;
            border: 1px solid #f2c3c3;
            font-size: 24px;
        }


        .delete-modal h3 {
            margin: 0 0 8px;
            color: #244d35;
            font-size: 20px;
            font-weight: 700;
        }


        .delete-modal p {
            margin: 0 auto;
            max-width: 340px;
            color: #68756d;
            font-size: 14px;
            line-height: 1.55;
        }


        .delete-modal-user {
            display: inline-block;
            margin-top: 5px;
            color: #315c43;
            font-weight: 700;
            word-break: break-word;
        }


        .delete-modal-warning {
            margin-top: 12px !important;
            color: #8b3030 !important;
            font-size: 12px !important;
        }


        .delete-modal-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 24px;
        }


        .delete-modal-btn {
            min-width: 115px;
            min-height: 40px;
            padding: 9px 16px;
            border-radius: 9px;
            border: 1px solid transparent;
            font-family: inherit;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition:
                background-color 0.2s ease,
                border-color 0.2s ease,
                color 0.2s ease,
                box-shadow 0.2s ease,
                transform 0.15s ease;
        }


        .delete-modal-btn:hover {
            transform: translateY(-1px);
        }


        .delete-modal-btn:active {
            transform: translateY(0);
        }


        .delete-modal-cancel {
            color: #315c43;
            background: #f4f8f5;
            border-color: #cbdacf;
        }


        .delete-modal-cancel:hover {
            background: #e9f1eb;
            border-color: #b9ccbe;
        }


        .delete-modal-confirm {
            color: #ffffff;
            background: #c62828;
            border-color: #c62828;
        }


        .delete-modal-confirm:hover {
            background: #aa2020;
            border-color: #aa2020;
            box-shadow: 0 5px 14px rgba(198, 40, 40, 0.22);
        }


        .delete-modal-btn:focus-visible {
            outline: 3px solid rgba(8, 120, 61, 0.18);
            outline-offset: 2px;
        }


        @keyframes deleteModalFadeIn {

            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }


        @keyframes deleteModalScaleIn {

            from {
                opacity: 0;
                transform: scale(0.96) translateY(6px);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }


        @media (max-width: 480px) {

            .delete-modal {
                padding: 24px 18px;
            }


            .delete-modal-actions {
                flex-direction: column-reverse;
            }


            .delete-modal-btn {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(style);

})();


/* =========================================================
   CLOSE DELETE CONFIRMATION
   ========================================================= */

function closeDeleteConfirmation() {

    const modal =
        getElement("deleteConfirmationModal");

    if (!modal) {
        return;
    }

    modal.remove();

    document.body.style.overflow = "";

    document.removeEventListener(
        "keydown",
        handleDeleteModalEscape
    );
}


/* =========================================================
   SHOW DELETE CONFIRMATION
   ========================================================= */

function showDeleteConfirmation(user) {

    closeDeleteConfirmation();


    const fullName =
        user.fullName ||
        [
            user.firstName,
            user.middleName,
            user.lastName
        ]
            .filter(Boolean)
            .join(" ") ||
        "this user";


    const overlay =
        document.createElement("div");

    overlay.id =
        "deleteConfirmationModal";

    overlay.className =
        "delete-modal-overlay";

    overlay.setAttribute(
        "role",
        "dialog"
    );

    overlay.setAttribute(
        "aria-modal",
        "true"
    );

    overlay.setAttribute(
        "aria-labelledby",
        "deleteModalTitle"
    );


    overlay.innerHTML = `
        <div
            class="delete-modal"
            role="document"
        >

            <div class="delete-modal-icon">
                <i class="fa-solid fa-trash-can"></i>
            </div>


            <h3 id="deleteModalTitle">
                Delete User?
            </h3>


            <p>
                Are you sure you want to delete
                <span class="delete-modal-user">
                    ${escapeHTML(fullName)}
                </span>?
            </p>


            <p class="delete-modal-warning">
                This action cannot be undone.
            </p>


            <div class="delete-modal-actions">

                <button
                    type="button"
                    class="delete-modal-btn delete-modal-cancel"
                    id="cancelDeleteButton"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="delete-modal-btn delete-modal-confirm"
                    id="confirmDeleteButton"
                >
                    <i class="fa-solid fa-trash-can"></i>
                    Delete User
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(
        overlay
    );

    document.body.style.overflow =
        "hidden";


    const cancelButton =
        getElement(
            "cancelDeleteButton"
        );


    const confirmButton =
        getElement(
            "confirmDeleteButton"
        );


    /* CANCEL BUTTON */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                closeDeleteConfirmation();

            }
        );

    }


    /* CONFIRM DELETE BUTTON */

    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            function () {

                performDeleteUser(
                    user.userId
                );

            }
        );

    }


    /* CLICK OUTSIDE MODAL */

    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === overlay
            ) {

                closeDeleteConfirmation();

            }

        }
    );


    /* ESC KEY */

    document.addEventListener(
        "keydown",
        handleDeleteModalEscape
    );


    setTimeout(
        function () {

            if (cancelButton) {
                cancelButton.focus();
            }

        },
        50
    );
}


/* =========================================================
   ESC KEY FOR DELETE POPUP
   ========================================================= */

function handleDeleteModalEscape(event) {

    if (event.key !== "Escape") {
        return;
    }


    const modal =
        getElement(
            "deleteConfirmationModal"
        );


    if (modal) {

        closeDeleteConfirmation();

    }

}


/* =========================================================
   DELETE USER
   ========================================================= */

function deleteUser(userId) {

    const users =
        getUsers();


    const user =
        users.find(
            item =>
                item.userId === userId
        );


    if (!user) {
        return;
    }


    /*
       Do NOT delete immediately.

       First show the confirmation
       popup so the user can choose
       Cancel or Delete User.
    */

    showDeleteConfirmation(
        user
    );
}


/* =========================================================
   ACTUALLY DELETE USER
   ========================================================= */

function performDeleteUser(userId) {

    const users =
        getUsers();


    const user =
        users.find(
            item =>
                item.userId === userId
        );


    if (!user) {

        closeDeleteConfirmation();

        return;
    }


    /*
       Remove the selected user.
    */

    const updatedUsers =
        users.filter(
            item =>
                item.userId !== userId
        );


    /*
       Save the updated user list
       back to Local Storage.
    */

    saveUsers(
        updatedUsers
    );


    /*
       Remove the user's privilege
       record as well.

       This prevents an old privilege
       record from remaining after
       the user has been deleted.
    */

    try {

        const savedPrivileges =
            JSON.parse(
                localStorage.getItem(
                    "htcampusUserPrivileges"
                ) || "{}"
            );


        if (
            Object.prototype.hasOwnProperty.call(
                savedPrivileges,
                userId
            )
        ) {

            delete savedPrivileges[
                userId
            ];


            localStorage.setItem(
                "htcampusUserPrivileges",
                JSON.stringify(
                    savedPrivileges
                )
            );

        }

    } catch (error) {

        console.error(
            "Unable to update stored privileges:",
            error
        );

    }


    /*
       Close the popup.
    */

    closeDeleteConfirmation();


    /*
       Refresh the Registered Users
       table immediately.
    */

    loadUsers();


    /*
       Refresh the privilege user
       dropdown as well.
    */

    loadPrivilegeUsers();

}

/* =========================================================
   TASK 7 - PRIVILEGE STORAGE
   ========================================================= */

function getPrivileges() {

    try {

        const saved =
            localStorage.getItem(
                PRIVILEGES_STORAGE_KEY
            );


        const privileges =
            saved
                ? JSON.parse(saved)
                : {};


        if (
            privileges &&
            typeof privileges ===
                "object" &&
            !Array.isArray(
                privileges
            )
        ) {

            return privileges;
        }


        return {};

    } catch (error) {

        console.error(
            "Unable to read privilege records:",
            error
        );

        return {};
    }
}


function savePrivileges(
    privileges
) {

    localStorage.setItem(
        PRIVILEGES_STORAGE_KEY,
        JSON.stringify(
            privileges
        )
    );
}


/* =========================================================
   PRIVILEGE DISPLAY
   ========================================================= */

function getPermissionLabels(
    permissions
) {

    const labels = [];


    if (
        permissions &&
        permissions.read
    ) {
        labels.push(
            "Read"
        );
    }


    if (
        permissions &&
        permissions.write
    ) {
        labels.push(
            "Write"
        );
    }


    if (
        permissions &&
        permissions.execute
    ) {
        labels.push(
            "Execute"
        );
    }


    if (
        permissions &&
        permissions.admin
    ) {
        labels.push(
            "Admin"
        );
    }


    return labels;
}


function formatExpirationDate(
    value
) {

    if (!value) {
        return "No expiration";
    }


    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


function formatUpdatedDate(
    value
) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "-";
    }


    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


/* =========================================================
   TASK 7 - STORED PRIVILEGE RECORDS TABLE
   ========================================================= */

function loadPrivilegeRecords() {

    const tableBody =
        getElement(
            "privilegeTableBody"
        );


    const recordCount =
        getElement(
            "privilegeCount"
        );


    if (!tableBody) {
        return;
    }


    const users =
        getUsers();


    const privileges =
        getPrivileges();


    const records =
        Object.entries(
            privileges
        )
        .filter(
            ([userId]) =>
                users.some(
                    user =>
                        (
                            user.userId ||
                            user.id
                        ) === userId
                )
        );


    if (recordCount) {

        recordCount.textContent =
            `${records.length} ${
                records.length === 1
                    ? "Record"
                    : "Records"
            }`;
    }


    if (
        records.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="privilege-empty-row"
                >

                    <i
                        class="fa-solid fa-shield-halved"
                    ></i>

                    <strong>
                        No privilege records saved
                    </strong>

                    <span>
                        Assign access to a registered
                        user to create a privilege record.
                    </span>

                </td>

            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        "";


    records.forEach(
        ([userId, record]) => {

            const user =
                users.find(
                    item =>
                        (
                            item.userId ||
                            item.id
                        ) === userId
                ) || {};


            const fullName =
                user.fullName ||
                [
                    user.firstName,
                    user.middleName,
                    user.lastName
                ]
                .filter(Boolean)
                .join(" ") ||
                "Unnamed User";


            const labels =
                getPermissionLabels(
                    record.permissions
                );


            const permissionHTML =
                labels.length > 0

                    ? labels
                        .map(
                            permission =>
                                `
                                <span
                                    class="privilege-badge"
                                >
                                    ${escapeHTML(
                                        permission
                                    )}
                                </span>
                                `
                        )
                        .join("")

                    : `
                        <span
                            class="
                                privilege-badge
                                no-permission-badge
                            "
                        >
                            None
                        </span>
                    `;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            userId
                        )}
                    </strong>
                </td>


                <td>

                    <span
                        class="privilege-user-name"
                    >
                        ${escapeHTML(
                            fullName
                        )}
                    </span>

                    <span
                        class="privilege-user-email"
                    >
                        ${escapeHTML(
                            user.email || "-"
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHTML(
                        record.module || "-"
                    )}
                </td>


                <td>

                    <div
                        class="privilege-badges"
                    >
                        ${permissionHTML}
                    </div>

                </td>


                <td>

                    <span
                        class="
                            privilege-expiration
                            ${
                                record.expirationDate
                                    ? ""
                                    : "no-expiration"
                            }
                        "
                    >
                        ${escapeHTML(
                            formatExpirationDate(
                                record.expirationDate
                            )
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="privilege-updated"
                    >
                        ${escapeHTML(
                            formatUpdatedDate(
                                record.updatedAt
                            )
                        )}
                    </span>

                </td>


                <td>

                    <div
                        class="privilege-action-buttons"
                    >

                        <button
                            type="button"
                            class="
                                privilege-action-button
                                edit
                            "
                            data-privilege-action="edit"
                            data-user-id="${escapeHTML(
                                userId
                            )}"
                        >

                            <i
                                class="fa-solid fa-pen-to-square"
                            ></i>

                            Edit

                        </button>


                        <button
                            type="button"
                            class="
                                privilege-action-button
                                delete
                            "
                            data-privilege-action="delete"
                            data-user-id="${escapeHTML(
                                userId
                            )}"
                        >

                            <i
                                class="fa-solid fa-trash-can"
                            ></i>

                            Remove

                        </button>

                    </div>

                </td>
            `;


            tableBody.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   PRIVILEGE USER DROPDOWN
   ========================================================= */

function loadPrivilegeUsers(
    selectedUserId = ""
) {

    const select =
        getElement(
            "privilegeUser"
        );


    if (!select) {
        return;
    }


    const currentValue =
        selectedUserId ||
        select.value;


    const users =
        getUsers();


    select.innerHTML =
        `
        <option value="">
            Select registered user
        </option>
        `;


    users.forEach(
        user => {

            const id =
                user.userId ||
                user.id;


            const name =
                user.fullName ||
                [
                    user.firstName,
                    user.middleName,
                    user.lastName
                ]
                .filter(Boolean)
                .join(" ") ||
                "Unnamed User";


            addOption(
                select,
                id,
                `${id} — ${name}`
            );
        }
    );


    if (
        currentValue &&
        users.some(
            user =>
                (
                    user.userId ||
                    user.id
                ) === currentValue
        )
    ) {

        select.value =
            currentValue;
    }
}


/* =========================================================
   LOAD PRIVILEGE RECORD INTO FORM
   ========================================================= */

function loadPrivilegeForUser(
    userId
) {

    if (!userId) {
        return;
    }


    const privileges =
        getPrivileges();


    const record =
        privileges[userId];


    if (!record) {

        const module =
            getElement(
                "systemModule"
            );

        const expiration =
            getElement(
                "expirationDate"
            );


        if (module) {
            module.value = "";
        }


        if (expiration) {
            expiration.value = "";
        }


        [
            "readPermission",
            "writePermission",
            "executePermission",
            "adminPermission"
        ]
        .forEach(
            id => {

                const checkbox =
                    getElement(id);

                if (checkbox) {
                    checkbox.checked =
                        false;
                }
            }
        );


        return;
    }


    const userSelect =
        getElement(
            "privilegeUser"
        );

    const moduleSelect =
        getElement(
            "systemModule"
        );

    const expiration =
        getElement(
            "expirationDate"
        );


    if (userSelect) {

        userSelect.value =
            userId;
    }


    if (moduleSelect) {

        moduleSelect.value =
            record.module || "";
    }


    if (expiration) {

        expiration.value =
            record.expirationDate || "";
    }


    const permissions =
        record.permissions || {};


    const read =
        getElement(
            "readPermission"
        );

    const write =
        getElement(
            "writePermission"
        );

    const execute =
        getElement(
            "executePermission"
        );

    const admin =
        getElement(
            "adminPermission"
        );


    if (read) {
        read.checked =
            !!permissions.read;
    }


    if (write) {
        write.checked =
            !!permissions.write;
    }


    if (execute) {
        execute.checked =
            !!permissions.execute;
    }


    if (admin) {
        admin.checked =
            !!permissions.admin;
    }


    [
        userSelect,
        moduleSelect,
        expiration
    ]
    .forEach(
        element =>
            clearFieldValidation(
                element
            )
    );


    const error =
        getElement(
            "permissionErrorMessage"
        );


    if (error) {
        error.textContent =
            "";
    }


    const area =
        document.querySelector(
            ".permissions-area"
        );


    if (area) {

        area.classList.remove(
            "permission-error"
        );
    }


    setMessage(
        "privilegeMessage",
        ""
    );
}


/* =========================================================
   PRIVILEGE VALIDATION
   ========================================================= */

function validatePrivilegeForm() {

    let valid =
        true;


    const userSelect =
        getElement(
            "privilegeUser"
        );

    const moduleSelect =
        getElement(
            "systemModule"
        );

    const expiration =
        getElement(
            "expirationDate"
        );

    const permissionError =
        getElement(
            "permissionErrorMessage"
        );


    clearFieldValidation(
        userSelect
    );

    clearFieldValidation(
        moduleSelect
    );

    clearFieldValidation(
        expiration
    );


    if (permissionError) {
        permissionError.textContent =
            "";
    }


    /* USER */

    if (
        !userSelect ||
        !userSelect.value
    ) {

        setFieldError(
            userSelect,
            "Please select a registered user."
        );

        valid = false;

    } else {

        setFieldSuccess(
            userSelect
        );
    }


    /* MODULE */

    if (
        !moduleSelect ||
        !moduleSelect.value
    ) {

        setFieldError(
            moduleSelect,
            "Please select a system module."
        );

        valid = false;

    } else {

        setFieldSuccess(
            moduleSelect
        );
    }


    /* PERMISSION */

    const checkboxes = [

        getElement(
            "readPermission"
        ),

        getElement(
            "writePermission"
        ),

        getElement(
            "executePermission"
        ),

        getElement(
            "adminPermission"
        )

    ]
    .filter(Boolean);


    const hasPermission =
        checkboxes.some(
            checkbox =>
                checkbox.checked
        );


    const permissionsArea =
        document.querySelector(
            ".permissions-area"
        );


    if (!hasPermission) {

        if (permissionError) {

            permissionError.innerHTML = `

                <i
                    class="fa-solid fa-circle-exclamation"
                ></i>

                Please select at least
                one permission level.
            `;
        }


        if (permissionsArea) {

            permissionsArea.classList.add(
                "permission-error"
            );
        }


        valid = false;

    } else {

        if (permissionsArea) {

            permissionsArea.classList.remove(
                "permission-error"
            );
        }
    }


    /* EXPIRATION */

    if (
        expiration &&
        expiration.value
    ) {

        if (
            expiration.value <
            todayISO()
        ) {

            setFieldError(
                expiration,
                "Expiration date cannot be a previous date."
            );

            valid = false;

        } else {

            setFieldSuccess(
                expiration
            );
        }
    }


    if (!valid) {

        setMessage(
            "privilegeMessage",

            `<i
                class="fa-solid fa-circle-exclamation"
            ></i>

            Please correct the highlighted
            fields before updating access.`,

            "error"
        );

    } else {

        setMessage(
            "privilegeMessage",
            ""
        );
    }


    return valid;
}


/* =========================================================
   PRIVILEGE FORM
   ========================================================= */

function setupPrivilegeForm() {

    const form =
        getElement(
            "privilegeForm"
        );


    if (!form) {
        return;
    }


    const expiration =
        getElement(
            "expirationDate"
        );


    if (expiration) {

        expiration.min =
            todayISO();


        expiration.addEventListener(
            "change",
            function () {

                if (
                    !this.value
                ) {

                    clearFieldValidation(
                        this
                    );

                    return;
                }


                if (
                    this.value <
                    todayISO()
                ) {

                    setFieldError(
                        this,
                        "Expiration date cannot be a previous date."
                    );

                } else {

                    setFieldSuccess(
                        this
                    );
                }
            }
        );
    }


    const privilegeUser =
        getElement(
            "privilegeUser"
        );


    if (privilegeUser) {

        privilegeUser.addEventListener(
            "change",
            function () {

                loadPrivilegeForUser(
                    this.value
                );
            }
        );
    }


    [
        "readPermission",
        "writePermission",
        "executePermission",
        "adminPermission"
    ]
    .forEach(
        id => {

            const checkbox =
                getElement(id);


            if (!checkbox) {
                return;
            }


            checkbox.addEventListener(
                "change",
                function () {

                    const hasPermission = [
                        "readPermission",
                        "writePermission",
                        "executePermission",
                        "adminPermission"
                    ]
                    .some(
                        permissionId =>
                            getElement(
                                permissionId
                            )?.checked
                    );


                    if (
                        hasPermission
                    ) {

                        const error =
                            getElement(
                                "permissionErrorMessage"
                            );


                        if (error) {
                            error.textContent =
                                "";
                        }


                        document
                            .querySelector(
                                ".permissions-area"
                            )
                            ?.classList
                            .remove(
                                "permission-error"
                            );
                    }
                }
            );
        }
    );


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                !validatePrivilegeForm()
            ) {
                return;
            }


            const userId =
                getValue(
                    "privilegeUser"
                );


            const module =
                getValue(
                    "systemModule"
                );


            const expirationDate =
                getValue(
                    "expirationDate"
                );


            const permissions = {

                read:
                    !!getElement(
                        "readPermission"
                    )?.checked,

                write:
                    !!getElement(
                        "writePermission"
                    )?.checked,

                execute:
                    !!getElement(
                        "executePermission"
                    )?.checked,

                admin:
                    !!getElement(
                        "adminPermission"
                    )?.checked
            };


            const privileges =
                getPrivileges();


            /*
             * Existing record:
             * UPDATE IT.
             *
             * No duplicate privilege
             * record is created.
             */

            privileges[userId] = {

                module:
                    module,

                permissions:
                    permissions,

                expirationDate:
                    expirationDate ||
                    null,

                updatedAt:
                    new Date()
                        .toISOString()
            };


            savePrivileges(
                privileges
            );


            /*
             * Immediately refresh
             * Task 7 table.
             */

            loadPrivilegeRecords();


            setMessage(
                "privilegeMessage",

                `<i
                    class="fa-solid fa-circle-check"
                ></i>

                User access updated successfully.
                The privilege record has been saved.`,

                "success"
            );


            /*
             * Return to User Access
             * after successful update.
             */

            setTimeout(
                function () {

                    showPage(
                        "userAccessPage"
                    );

                    loadUsers();

                    loadPrivilegeRecords();

                },
                700
            );
        }
    );
}


/* =========================================================
   PRIVILEGE TABLE ACTIONS
   ========================================================= */

function setupPrivilegeTableActions() {

    const tableBody =
        getElement(
            "privilegeTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-privilege-action]"
                );


            if (!button) {
                return;
            }


            const userId =
                button.dataset.userId;


            const action =
                button.dataset.privilegeAction;


            if (!userId) {
                return;
            }


            /* =================================================
               EDIT PRIVILEGE
               ================================================= */

            if (
                action === "edit"
            ) {

                loadPrivilegeUsers(
                    userId
                );


                loadPrivilegeForUser(
                    userId
                );


                showPage(
                    "privilegePage"
                );


                return;
            }


            /* =================================================
               REMOVE PRIVILEGE
               ================================================= */

            if (
                action === "delete"
            ) {

                const users =
                    getUsers();


                const user =
                    users.find(
                        item =>
                            (
                                item.userId ||
                                item.id
                            ) === userId
                    );


                const userName =
                    user?.fullName ||
                    [
                        user?.firstName,
                        user?.middleName,
                        user?.lastName
                    ]
                    .filter(Boolean)
                    .join(" ") ||
                    userId;


                /*
                   Show the custom confirmation popup.

                   DO NOT use window.confirm().
                */

                showRemovePrivilegeConfirmation(
                    userId,
                    userName
                );

                return;
            }
        }
    );
}


/* =========================================================
   REMOVE PRIVILEGE CONFIRMATION POPUP STYLES
   ========================================================= */

(function addRemovePrivilegeConfirmationStyles() {

    if (
        document.getElementById(
            "removePrivilegeConfirmationStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "removePrivilegeConfirmationStyles";


    style.textContent = `

        /* =================================================
           REMOVE PRIVILEGE MODAL
           ================================================= */

        .remove-privilege-modal-overlay {

            position: fixed;

            inset: 0;

            z-index: 100000;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background:
                rgba(
                    20,
                    35,
                    27,
                    0.55
                );

            backdrop-filter:
                blur(3px);

            -webkit-backdrop-filter:
                blur(3px);

            animation:
                removePrivilegeFadeIn
                0.18s
                ease;
        }


        .remove-privilege-modal {

            width:
                min(
                    430px,
                    100%
                );

            padding:
                28px;

            background:
                #ffffff;

            border:
                1px solid
                #e6eee9;

            border-radius:
                16px;

            text-align:
                center;

            box-shadow:
                0 18px 50px
                rgba(
                    0,
                    0,
                    0,
                    0.22
                );

            animation:
                removePrivilegeScaleIn
                0.2s
                ease;
        }


        .remove-privilege-modal-icon {

            width:
                58px;

            height:
                58px;

            margin:
                0 auto 16px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            border-radius:
                50%;

            color:
                #c62828;

            background:
                #fff1f1;

            border:
                1px solid
                #f2c3c3;

            font-size:
                24px;
        }


        .remove-privilege-modal h3 {

            margin:
                0 0 8px;

            color:
                #244d35;

            font-size:
                20px;

            font-weight:
                700;
        }


        .remove-privilege-modal p {

            margin:
                0 auto;

            max-width:
                350px;

            color:
                #68756d;

            font-size:
                14px;

            line-height:
                1.55;
        }


        .remove-privilege-user {

            display:
                inline-block;

            margin-top:
                5px;

            color:
                #315c43;

            font-weight:
                700;

            word-break:
                break-word;
        }


        .remove-privilege-warning {

            margin-top:
                12px !important;

            color:
                #8b3030 !important;

            font-size:
                12px !important;
        }


        .remove-privilege-modal-actions {

            display:
                flex;

            justify-content:
                center;

            gap:
                10px;

            margin-top:
                24px;
        }


        .remove-privilege-modal-btn {

            min-width:
                115px;

            min-height:
                40px;

            padding:
                9px 16px;

            border-radius:
                9px;

            border:
                1px solid
                transparent;

            font-family:
                inherit;

            font-size:
                13px;

            font-weight:
                600;

            cursor:
                pointer;

            transition:
                background-color
                0.2s ease,

                border-color
                0.2s ease,

                color
                0.2s ease,

                box-shadow
                0.2s ease,

                transform
                0.15s ease;
        }


        .remove-privilege-modal-btn:hover {

            transform:
                translateY(-1px);
        }


        .remove-privilege-modal-btn:active {

            transform:
                translateY(0);
        }


        .remove-privilege-cancel {

            color:
                #315c43;

            background:
                #f4f8f5;

            border-color:
                #cbdacf;
        }


        .remove-privilege-cancel:hover {

            background:
                #e9f1eb;

            border-color:
                #b9ccbe;
        }


        .remove-privilege-confirm {

            color:
                #ffffff;

            background:
                #c62828;

            border-color:
                #c62828;
        }


        .remove-privilege-confirm:hover {

            background:
                #aa2020;

            border-color:
                #aa2020;

            box-shadow:
                0 5px 14px
                rgba(
                    198,
                    40,
                    40,
                    0.22
                );
        }


        .remove-privilege-modal-btn:focus-visible {

            outline:
                3px solid
                rgba(
                    8,
                    120,
                    61,
                    0.18
                );

            outline-offset:
                2px;
        }


        @keyframes removePrivilegeFadeIn {

            from {

                opacity:
                    0;
            }

            to {

                opacity:
                    1;
            }
        }


        @keyframes removePrivilegeScaleIn {

            from {

                opacity:
                    0;

                transform:
                    scale(0.96)
                    translateY(6px);
            }

            to {

                opacity:
                    1;

                transform:
                    scale(1)
                    translateY(0);
            }
        }


        @media (max-width: 480px) {

            .remove-privilege-modal {

                padding:
                    24px 18px;
            }


            .remove-privilege-modal-actions {

                flex-direction:
                    column-reverse;
            }


            .remove-privilege-modal-btn {

                width:
                    100%;
            }
        }
    `;


    document.head.appendChild(
        style
    );

})();


/* =========================================================
   CLOSE REMOVE PRIVILEGE POPUP
   ========================================================= */

function closeRemovePrivilegeConfirmation() {

    const modal =
        getElement(
            "removePrivilegeConfirmationModal"
        );


    if (!modal) {
        return;
    }


    modal.remove();


    document.body.style.overflow =
        "";


    document.removeEventListener(
        "keydown",
        handleRemovePrivilegeModalEscape
    );
}


/* =========================================================
   ESC KEY FOR REMOVE PRIVILEGE POPUP
   ========================================================= */

function handleRemovePrivilegeModalEscape(
    event
) {

    if (
        event.key ===
        "Escape"
    ) {

        closeRemovePrivilegeConfirmation();
    }
}


/* =========================================================
   SHOW REMOVE PRIVILEGE POPUP
   ========================================================= */

function showRemovePrivilegeConfirmation(
    userId,
    userName
) {

    closeRemovePrivilegeConfirmation();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "removePrivilegeConfirmationModal";


    overlay.className =
        "remove-privilege-modal-overlay";


    overlay.setAttribute(
        "role",
        "dialog"
    );


    overlay.setAttribute(
        "aria-modal",
        "true"
    );


    overlay.setAttribute(
        "aria-labelledby",
        "removePrivilegeModalTitle"
    );


    overlay.innerHTML = `

        <div
            class="remove-privilege-modal"
            role="document"
        >

            <div
                class="remove-privilege-modal-icon"
            >

                <i
                    class="fa-solid fa-shield-halved"
                ></i>

            </div>


            <h3
                id="removePrivilegeModalTitle"
            >
                Remove Privilege?
            </h3>


            <p>

                Are you sure you want to remove
                the saved privileges for

                <span
                    class="remove-privilege-user"
                >
                    ${escapeHTML(userName)}
                </span>?

            </p>


            <p
                class="remove-privilege-warning"
            >
                This will remove the stored
                access permissions for this user.
            </p>


            <div
                class="remove-privilege-modal-actions"
            >

                <button
                    type="button"
                    class="
                        remove-privilege-modal-btn
                        remove-privilege-cancel
                    "
                    id="cancelRemovePrivilegeButton"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="
                        remove-privilege-modal-btn
                        remove-privilege-confirm
                    "
                    id="confirmRemovePrivilegeButton"
                >
                    Remove Privilege
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(
        overlay
    );


    document.body.style.overflow =
        "hidden";


    const cancelButton =
        getElement(
            "cancelRemovePrivilegeButton"
        );


    const confirmButton =
        getElement(
            "confirmRemovePrivilegeButton"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                closeRemovePrivilegeConfirmation();
            }
        );
    }


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            function () {

                performRemovePrivilege(
                    userId
                );
            }
        );
    }


    document.addEventListener(
        "keydown",
        handleRemovePrivilegeModalEscape
    );


    if (cancelButton) {

        cancelButton.focus();
    }
}


/* =========================================================
   ACTUALLY REMOVE PRIVILEGE
   ========================================================= */

function performRemovePrivilege(
    userId
) {

    if (!userId) {

        closeRemovePrivilegeConfirmation();

        return;
    }


    const privileges =
        getPrivileges();


    if (
        Object.prototype.hasOwnProperty.call(
            privileges,
            userId
        )
    ) {

        delete privileges[
            userId
        ];


        savePrivileges(
            privileges
        );
    }


    /*
       Close the popup.
    */

    closeRemovePrivilegeConfirmation();


    /*
       Refresh the stored privilege
       records table immediately.
    */

    loadPrivilegeRecords();
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(
    pageId
) {

    const pages = [
        "userAccessPage",
        "addUserPage",
        "privilegePage"
    ];


    pages.forEach(
        id => {

            const page =
                getElement(id);


            if (page) {

                page.classList.add(
                    "hidden"
                );
            }
        }
    );


    const page =
        getElement(
            pageId
        );


    if (page) {

        page.classList.remove(
            "hidden"
        );
    }


    if (
        pageId ===
        "userAccessPage"
    ) {

        loadUsers();

        loadPrivilegeRecords();
    }


    if (
        pageId ===
        "privilegePage"
    ) {

        loadPrivilegeUsers();
    }
}


/* =========================================================
   NAVIGATION BUTTONS
   ========================================================= */

function setupNavigation() {

    const openAdd =
        getElement(
            "openAddUserButton"
        );


    const openPrivilege =
        getElement(
            "openPrivilegeButton"
        );


    const backAdd =
        getElement(
            "backFromAddUser"
        );


    const backPrivilege =
        getElement(
            "backFromPrivilege"
        );


    const cancelAdd =
        getElement(
            "cancelAddUser"
        );


    const cancelPrivilege =
        getElement(
            "cancelPrivilege"
        );


    if (openAdd) {

        openAdd.addEventListener(
            "click",
            function () {
                editingUserId = null;
                resetAddUserFormFields();
                showPage("addUserPage");
            }
        );
    }


    if (openPrivilege) {

        openPrivilege.addEventListener(
            "click",
            function () {

                loadPrivilegeUsers();

                loadPrivilegeRecords();

                showPage(
                    "privilegePage"
                );
            }
        );
    }


    if (backAdd) {

        backAdd.addEventListener(
            "click",
            function () {
                editingUserId = null;
                resetAddUserFormFields();
                showPage("userAccessPage");
            }
        );
    }


    if (backPrivilege) {

        backPrivilege.addEventListener(
            "click",
            function () {
                showPage("userAccessPage");
            }
        );
    }


    if (cancelAdd) {

        cancelAdd.addEventListener(
            "click",
            function () {
                editingUserId = null;
                resetAddUserFormFields();
                showPage("userAccessPage");
            }
        );
    }


    if (cancelPrivilege) {

        cancelPrivilege.addEventListener(
            "click",
            function () {

                showPage(
                    "userAccessPage"
                );
            }
        );
    }
}


/* =========================================================
   REGISTERED USER TABLE ACTION
   ========================================================= */

function setupUserTableActions() {

    const tableBody =
        getElement(
            "usersTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {
                return;
            }


            const userId =
                button.dataset.userId;


            const action =
                button.dataset.action;


            if (action === "edit") {
                startEditUser(userId);
                return;
            }

            if (action === "delete") {
                deleteUser(userId);
            }

            /*
             * Manage Access remains separate from Registered Users.
             * Privilege editing is handled in Stored Privilege Records.
             */
        }
    );
}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

function setupLogin() {

    const form =
        getElement(
            "adminLoginForm"
        );


    const username =
        getElement(
            "adminUsername"
        );


    const password =
        getElement(
            "adminPassword"
        );


    const message =
        getElement(
            "adminLoginMessage"
        );


    if (!form) {
        return;
    }


    function loginFieldError(
        element,
        text
    ) {

        if (!element) {
            return;
        }


        element.classList.add(
            "login-invalid"
        );


        let error =
            element
                .parentElement
                ?.parentElement
                ?.querySelector(
                    ".validation-message"
                );


        if (!error) {

            error =
                document.createElement(
                    "small"
                );

            error.className =
                "validation-message";


            element
                .parentElement
                ?.parentElement
                ?.appendChild(
                    error
                );
        }


        error.textContent =
            text;
    }


    function clearLoginError(
        element
    ) {

        if (!element) {
            return;
        }


        element.classList.remove(
            "login-invalid"
        );


        const error =
            element
                .parentElement
                ?.parentElement
                ?.querySelector(
                    ".validation-message"
                );


        if (error) {

            error.textContent =
                "";
        }
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearLoginError(
                username
            );

            clearLoginError(
                password
            );


            let valid =
                true;


            if (
                !username ||
                !username.value.trim()
            ) {

                loginFieldError(
                    username,
                    "Username / Email is required."
                );

                valid = false;
            }


            if (
                !password ||
                !password.value
            ) {

                loginFieldError(
                    password,
                    "Password must not be blank."
                );

                valid = false;
            }


            if (!valid) {

                if (message) {

                    message.textContent =
                        "Please complete the required fields.";
                }

                return;
            }


            if (
                username.value.trim() ===
                    ADMIN_USERNAME &&
                password.value ===
                    ADMIN_PASSWORD
            ) {

                sessionStorage.setItem(
                    ADMIN_SESSION_KEY,
                    "true"
                );


                const remember =
                    getElement(
                        "rememberAdmin"
                    );


                if (
                    remember &&
                    remember.checked
                ) {

                    localStorage.setItem(
                        ADMIN_REMEMBER_KEY,
                        "true"
                    );

                } else {

                    localStorage.removeItem(
                        ADMIN_REMEMBER_KEY
                    );
                }


                getElement(
                    "adminLoginScreen"
                )?.classList.add(
                    "hidden"
                );


                getElement(
                    "adminDashboard"
                )?.classList.remove(
                    "hidden"
                );


                loadUsers();

                loadPrivilegeUsers();

                loadPrivilegeRecords();


                if (message) {

                    message.textContent =
                        "";
                }

            } else {

                if (message) {

                    message.textContent =
                        "Invalid username or password.";
                }


                loginFieldError(
                    password,
                    "The username or password is incorrect."
                );
            }
        }
    );
}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    const button =
        getElement(
            "adminLogoutButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                ADMIN_SESSION_KEY
            );


            getElement(
                "adminDashboard"
            )?.classList.add(
                "hidden"
            );


            getElement(
                "adminLoginScreen"
            )?.classList.remove(
                "hidden"
            );


            const loginForm =
                getElement(
                    "adminLoginForm"
                );


            if (loginForm) {
                loginForm.reset();
            }
        }
    );
}


/* =========================================================
   SESSION RESTORE
   ========================================================= */

function restoreAdminSession() {

    const loggedIn =
        sessionStorage.getItem(
            ADMIN_SESSION_KEY
        );


    const remembered =
        localStorage.getItem(
            ADMIN_REMEMBER_KEY
        );


    if (
        loggedIn === "true" ||
        remembered === "true"
    ) {

        getElement(
            "adminLoginScreen"
        )?.classList.add(
            "hidden"
        );


        getElement(
            "adminDashboard"
        )?.classList.remove(
            "hidden"
        );


        loadUsers();

        loadPrivilegeUsers();

        loadPrivilegeRecords();
    }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupBirthdateDropdowns();

        setupLocationDropdowns();

        attachAddUserLiveValidation();

        setupAddUserForm();

        setupPrivilegeForm();

        setupPrivilegeTableActions();

        setupNavigation();

        setupUserTableActions();

        setupLogin();

        setupLogout();

        loadUsers();

        loadPrivilegeUsers();

        loadPrivilegeRecords();

        restoreAdminSession();


        const expiration =
            getElement(
                "expirationDate"
            );


        if (expiration) {

            expiration.min =
                todayISO();
        }
    }
);