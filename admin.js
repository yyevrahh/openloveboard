const firebaseConfig = {
  apiKey: "AIzaSyDbCwBoLBUQRBRVRRGtRQY5RN87e4HXekk",
  authDomain: "openloveboard.firebaseapp.com",
  projectId: "openloveboard",
  storageBucket: "openloveboard.firebasestorage.app",
  messagingSenderId: "319903384288",
  appId: "1:319903384288:web:5d1e8033a2bdfb02e88685",
  measurementId: "G-M6XN9MQ3SK"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);
const db = firebase.firestore(app);

const quotes = [
    "Tayo ay nasa ✨fine dining restaurant✨",
    "admin ba kayo mæm?",
    "SANDALE!",
    "medjo naguluhan ako nak",
    "'di porket tulala, sabog. miss lng kita.",
    "kapag tumila na ang ulan, walang ulan",
    "minsan everyday",
    "pake ko?",
    "mga sintomas na wala kanang utak",
    "6'6 btw..",
    "Admin's got infinite rizz 🔥🔥🔥🔥"
];

let userId;

auth.onAuthStateChanged((user) => {
    if (user) {
        userId = user.uid;
        console.log("User " + user.displayName + " logged in.");
        console.log("User ID: " + userId);
    } else {
        console.log("No user is signed in.");
        window.location.href = "../";
    }
});

$('#submit').on('click', async () => {
    if (!userId) {
        alert("You must be logged in to add a message.");
        return;
    }

    const recipientName = $('#recipientName').val().trim();
    const recipientStrandSection = $('#recipientStrandSection').val().trim();
    const senderName = $('#senderName').val().trim() || "Anonymous";
    const message = $('#message').val().trim();
    const pin = $('#pin').val().trim();
    const reason = $('#reason').val().trim().toLowerCase();
    const note = $('#note').val().trim();
    const date = new Date();

    if (!recipientName || !recipientStrandSection || !message || !reason || !pin) {
        alert("Recipient name, message, and reason are required.");
        return;
    }

    try {
        await db.collection("messages").add({
            recipientName: recipientName,
            strand: recipientStrandSection,
            senderName: senderName,
            message: message,
            pin: pin,
            reason: reason,
            note: note,
            date: date
        });

        alert("Message added successfully!");
        $("input").val("");
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to add message.");
    }
});

$("#submit").on('click', function() {
    $(".p").html(quotes[Math.floor(Math.random()*quotes.length)]);
});