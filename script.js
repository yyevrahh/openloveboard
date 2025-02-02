$(window).on('load', function () {
    $('.loader').fadeOut();
    $('.content').fadeIn();
    $('.content').addClass('visible');
});

const firebaseConfig = {
    apiKey: "AIzaSyAnzS56LxOeG3PysO1ELZdcVbFwXu9-sj0",
    authDomain: "openloveboard.firebaseapp.com",
    projectId: "openloveboard",
    storageBucket: "openloveboard.firebasestorage.app",
    messagingSenderId: "319903384288",
    appId: "1:319903384288:web:5d1e8033a2bdfb02e88685",
    measurementId: "G-M6XN9MQ3SK"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const messagesContainer = $(".messages");

function loadRecentMessages() {
    db.collection("messages")
        .orderBy("date", "desc")
        .limit(10)
        .get()
        .then(snapshot => {
            messagesContainer.empty();
            snapshot.forEach(doc => {
                const data = doc.data();
                const imagePath = `res/${data.reason}.png`;
                const messageItem = $(`
                    <div class="messageItem" style="background-image: url('${imagePath}');">
                        <div class="recipient-name">${data.recipientName}</div>
                        <div class="recipient-strand"><strong>Strand:</strong> ${data.strand}</div>
                        <div class="sender-name"><strong>From:</strong> ${data.senderName}</div>
                        <div class="message-content">"${data.message}"</div>
                    </div>
                `);
                messagesContainer.append(messageItem);
            });
        })
        .catch(error => console.error("Error loading messages:", error));
}

$(document).ready(loadRecentMessages);

const recipientInput = $("#recipientName");
const strandInput = $("#recipientStrandSection");
const searchButton = $(".search");

function searchMessages() {
    let query = db.collection("messages").orderBy("date", "desc");

    const recipientName = recipientInput.val().trim();
    const strand = strandInput.val().trim();

    if (recipientName) {
        query = query.where("recipientName", "==", recipientName);
    }
    if (strand) {
        query = query.where("strand", "==", strand);
    }

    query.get()
        .then(snapshot => {
            messagesContainer.empty();
            if (snapshot.empty) {
                messagesContainer.html("<p>No messages found.</p>");
                return;
            }

            snapshot.forEach(doc => {
                const data = doc.data();
                let showMessage = false;

                if (recipientName && data.recipientName.includes(recipientName)) {
                    showMessage = true;
                }

                if (strand && data.strand.includes(strand)) {
                    showMessage = true;
                }

                if (showMessage) {
                    const imagePath = `res/${data.reason}.png`;
                    const messageItem = $(`
                        <div class="messageItem" style="background-image: url('${imagePath}');">
                            <div class="recipient-name">${data.recipientName}</div>
                            <div class="recipient-strand"><strong>Strand:</strong> ${data.strand}</div>
                            <div class="sender-name"><strong>From:</strong> ${data.senderName}</div>
                            <div class="message-content">"${data.message}"</div>
                        </div>
                    `);
                    messagesContainer.append(messageItem);
                }
            });
        })
        .catch(error => console.error("Error fetching messages:", error));
}

searchButton.on("click", searchMessages);
