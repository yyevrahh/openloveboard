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
    const messagesDiv = document.querySelector('.messages');
    
    messagesDiv.classList.add('loading');

    setTimeout(() => {
        messagesDiv.classList.remove('loading');
    }, 2000);
    
    displayMessages(matchedMessages);
}

$(".search").on("click", searchMessages);

function displayMessages(messages) {
    messagesContainer.empty();
    if (messages.length === 0) {
        messagesContainer.html("<p>No messages found.</p>");
        return;
    }
    
    messages.forEach((data, index) => {
        const imagePath = `res/${data.reason}.png`;
        let color = getColor(data.reason);

        const messageItem = $(`
            <div class="message-item hidden">
               <div class="head toggle">
                    <div class="pin"></div>
                    <div class="message-info">
                        <div class="recipient-name">Message for: ${data.recipientName}</div>
                        <div class="strand">${data.strand}</div>
                        <div class="sender-name">From: ${data.senderName}</div>
                    </div>
               </div>
               <div class="body" style="display: none; background: ${color};">
                    <div class="message panel">"${data.message}"</div>
               </div>
            </div>
        `);

        messagesContainer.append(messageItem);

        setTimeout(() => {
            messageItem.removeClass("hidden");
        }, index * 300);
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
    $(this).closest(".message-item").find(".panel").stop(true, true).slideToggle(300);
});
