$(window).on('load', function () {
    $('.loader').fadeOut();
    $('.content').fadeIn();
    $('.content').addClass('visible');
});

const firebaseConfig = {
    apiKey: "AIzaSyDbCwBoLBUQRBRVRRGtRQY5RN87e4HXekk",
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

let lunrIndex;
let messagesData = [];

function loadAndIndexMessages() {
    db.collection("messages").orderBy("date", "desc").get()
        .then(snapshot => {
            messagesData = [];

            snapshot.forEach(doc => {
                let data = doc.data();
                data.id = doc.id;
                messagesData.push(data);
            });

            lunrIndex = lunr(function () {
                this.ref("id");
                this.field("recipientName");
                this.field("strand");
                messagesData.forEach(doc => this.add(doc), this);
            });

            searchMessages();
            displayMessages(messagesData.slice(0, 5));
        })

        .catch(error => console.error("Error loading messages:", error)
    );
}

$(document).ready(loadAndIndexMessages);

function searchMessages() {
    const nameQuery = $("#recipientName").val().trim();
    const strandQuery = $("#recipientStrandSection").val().trim();

    if (!nameQuery && !strandQuery) {
        displayMessages(messagesData);
        return;
    }

    const results = lunrIndex.search(nameQuery + ' ' + strandQuery);
    const matchedMessages = results.map(r => messagesData.find(msg => msg.id === r.ref));

    displayMessages(matchedMessages);
}

$(".search").on("click", searchMessages);

function displayMessages(messages) {
    messagesContainer.empty();
    if (messages.length === 0) {
        messagesContainer.html("<p>No messages found.</p>");
        return;
    }
    
    messages.forEach(data => {
        const imagePath = `res/${data.reason}.png`;
        let color = getColor(data.reason);

        //  style="background-image: url('${imagePath}');" to message item

        const messageItem = $(`
            <div class="message-item">
               <div class="head toggle">
                    <div class="pin"></div>
                    <div class="message-info">
                        <div class="recipient-name">${data.recipientName}</div>
                        <div class="strand">${data.strand}</div>
                        <div class="sender-name">${data.senderName}</div>
                    </div>
               </div>
               <div class="body panel" style="display: none; background: ${color};">
                    <div class="message">${data.message}</div>
               </div>
            </div>
        `);
        messagesContainer.append(messageItem);
    });
}

function getColor(reason) {
    return {
        love: "pink",
        friend: "lightgoldenrodyellow",
        confession: "plum",
        support: "skyblue"
    }[reason] || "greenyellow";
}

$(document).on("click", ".toggle", function() {
    $(this).next(".panel").stop(true, true).slideToggle();
});
