/* =========================================================
   HTCampusBot - JavaScript
   Holy Trinity College
   ========================================================= */


/* =========================================================
   1. SELECT ELEMENTS
   ========================================================= */

const chatbot = document.querySelector(".chatbot-window");
const floatingChat = document.querySelector(".floating-chat");
const closeChat = document.querySelector(".close-chat");

const chatButtons = document.querySelectorAll(".chat-btn");
const askButton = document.querySelector(".primary-btn");

const secondaryButton = document.querySelector(".secondary-btn");

const sendButton = document.querySelector(".chat-footer button");
const messageInput = document.querySelector(".chat-footer input");

const chatBody = document.querySelector(".chat-body");

const quickButtons = document.querySelectorAll(".quick-links button");


/* =========================================================
   2. OPEN CHATBOT
   ========================================================= */

function openChatbot() {

    chatbot.style.display = "flex";

    floatingChat.style.display = "none";

}


/* =========================================================
   3. CLOSE CHATBOT
   ========================================================= */

function closeChatbot() {

    chatbot.style.display = "none";

    floatingChat.style.display = "flex";

}


/* =========================================================
   4. CHAT BUTTONS
   ========================================================= */

floatingChat.addEventListener("click", function () {

    openChatbot();

});


chatButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();

        openChatbot();

    });

});


askButton.addEventListener("click", function () {

    openChatbot();

});


closeChat.addEventListener("click", function () {

    closeChatbot();

});


/* =========================================================
   5. LEARN MORE BUTTON
   ========================================================= */

secondaryButton.addEventListener("click", function () {

    document.querySelector(".features").scrollIntoView({

        behavior: "smooth"

    });

});


/* =========================================================
   6. CHATBOT RESPONSES
   ========================================================= */

function getBotResponse(message) {

    const text = message.toLowerCase();


    /* Enrollment */

    if (
        text.includes("enrollment") ||
        text.includes("enroll")
    ) {

        return "For enrollment information, please prepare the required documents and follow the enrollment procedures provided by Holy Trinity College. Please contact the appropriate school office for the latest requirements.";

    }


    /* Admission */

    if (
        text.includes("admission") ||
        text.includes("apply") ||
        text.includes("application")
    ) {

        return "For admission concerns, applicants may inquire about admission requirements, application procedures, schedules, and other requirements through the appropriate HTC office.";

    }


    /* Tuition */

    if (
        text.includes("tuition") ||
        text.includes("fee") ||
        text.includes("fees")
    ) {

        return "For tuition and school fee information, please refer to the official HTC announcements or contact the Accounting Office for the latest and most accurate information.";

    }


    /* Scholarship */

    if (
        text.includes("scholarship") ||
        text.includes("financial aid")
    ) {

        return "Holy Trinity College offers scholarship opportunities subject to specific requirements and policies. Please contact the Scholarship Office for current scholarship programs and requirements.";

    }


    /* Office hours */

    if (
        text.includes("office hours") ||
        text.includes("office schedule") ||
        text.includes("open")
    ) {

        return "Office schedules may vary depending on the department. Please check the latest official HTC announcements or contact the appropriate office.";

    }


    /* Programs */

    if (
        text.includes("course") ||
        text.includes("program") ||
        text.includes("degree")
    ) {

        return "HTCampusBot can provide information about academic programs and courses offered by Holy Trinity College. Please specify the program you are interested in.";

    }


    /* Policies */

    if (
        text.includes("policy") ||
        text.includes("policies") ||
        text.includes("rules")
    ) {

        return "For school policies and regulations, please refer to the official student handbook and current announcements of Holy Trinity College.";

    }


    /* Greeting */

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {

        return "Hello! 👋 Welcome to HTCampusBot. How can I help you with Holy Trinity College information?";

    }


    /* Default */

    return "Thank you for your question! This is currently a prototype of HTCampusBot. The full system will provide information about enrollment, admission, tuition fees, scholarships, academic programs, school policies, office schedules, and other HTC services.";

}


/* =========================================================
   7. ADD MESSAGE TO CHAT
   ========================================================= */

function addMessage(message, sender) {

    const messageElement = document.createElement("div");


    if (sender === "user") {

        messageElement.classList.add("user-message");

        messageElement.textContent = message;

    } else {

        messageElement.classList.add("bot-message");

        messageElement.textContent = message;

    }


    chatBody.appendChild(messageElement);


    chatBody.scrollTop = chatBody.scrollHeight;

}


/* =========================================================
   8. SEND MESSAGE
   ========================================================= */

function sendMessage() {

    const message = messageInput.value.trim();


    if (message === "") {

        return;

    }


    /* Display user's message */

    addMessage(message, "user");


    /* Clear input */

    messageInput.value = "";


    /* Show bot response after a short delay */

    setTimeout(function () {

        const response = getBotResponse(message);

        addMessage(response, "bot");

    }, 500);

}


/* =========================================================
   9. SEND BUTTON
   ========================================================= */

sendButton.addEventListener("click", function () {

    sendMessage();

});


/* =========================================================
   10. ENTER KEY
   ========================================================= */

messageInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();

    }

});


/* =========================================================
   11. QUICK QUESTION BUTTONS
   ========================================================= */

quickButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const question = button.textContent.trim();

        addMessage(question, "user");


        setTimeout(function () {

            const response = getBotResponse(question);

            addMessage(response, "bot");

        }, 500);

    });

});


/* =========================================================
   12. CLOSE CHAT WITH ESC KEY
   ========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeChatbot();

    }

});