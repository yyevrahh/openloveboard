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
    const nameQuery = $("#recipientName").val().trim().toLowerCase();
    const strandQuery = $("#recipientStrandSection").val().trim().toLowerCase();

    let searchQuery = '';
    if (nameQuery) searchQuery += `${nameQuery}* `;
    if (strandQuery) searchQuery += `${strandQuery}*`;

    const results = lunrIndex.search(searchQuery.trim());
    const matchedMessages = results.map(r => messagesData.find(msg => msg.id === r.ref));

    const filteredMessages = matchedMessages.filter(msg =>
        (!nameQuery || msg.recipientName.toLowerCase().includes(nameQuery)) &&
        (!strandQuery || msg.strand.toLowerCase().includes(strandQuery))
    );

    const messagesDiv = document.querySelector('.messages');
    messagesDiv.classList.add('loading');

    setTimeout(() => {
        messagesDiv.classList.remove('loading');
    }, 2000);

    displayMessages(filteredMessages);
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
        let pinImage = getPinNumber(data.pin);

        const messageItem = $(`
            <div class="message-item hidden" style="background: ${color};">
               <div class="head toggle">
                    <div class="pin" style="background-image: url('res/${pinImage}');"></div>
                    <div class="message-info">
                        <div class="recipient-name">Message for ${data.recipientName}</div>
                        <div class="strand">${data.strand}</div>
                        <div class="sender-name">From ${data.senderName}</div>
                    </div>
               </div>
               <div class="body panel" style="display: none; background: ${color};">
                    <div class="message">"${data.message}"</div>
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
        love: "#ff5baa",
        appreciation: "#91f26f",
        friend: "#ffec85",
        confession: "#f471ff",
        support: "#6fa8f2"
    }[reason] || "#ff5baa";
}


function getPinNumber(pin) {
    return {
        pin_1: "1.png",
        pin_2: "2.png",
        pin_3: "3.png",
        pin_4: "4.png",
        pin_5: "5.png",
        pin_6: "6.png",
        pin_7: "7.png",
        pin_8: "8.png",
        pin_9: "9.png",
        pin_10: "10.png",
        pin_11: "11.png",
        pin_12: "12.png",
        pin_13: "13.png",
        pin_14: "14.png",
        pin_15: "15.png",
        pin_16: "16.png",
        pin_17: "17.png",
        pin_18: "18.png",
        pin_19: "19.png",
        pin_20: "20.png",
        pin_21: "21.png"
    }[pin] || "21.png";
}
$(document).on("click", ".toggle", function() {
    $(this).next(".panel").stop(true, true).slideToggle(300);
});
