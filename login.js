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

const googleSignInButton = document.querySelector('button');

googleSignInButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            console.log("Signed in as:", result.user.displayName);
            window.location.href = "admin.html";
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
});