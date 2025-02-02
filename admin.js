const firebaseConfig = {
  apiKey: "AIzaSyAnzS56LxOeG3PysO1ELZdcVbFwXu9-sj0",
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
    const reason = $('#reason').val().trim().toLowerCase();
    const note = $('#note').val().trim();
    const date = new Date();

    if (!recipientName || !message || !reason) {
        alert("Recipient name, message, and reason are required.");
        return;
    }

    try {
        await db.collection("messages").add({
            recipientName: recipientName,
            strand: recipientStrandSection,
            senderName: senderName,
            message: message,
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