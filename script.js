// Initialize Firebase (add your config)
const firebaseConfig = {
  apiKey: "AIzaSyAJAs6fWzzH9V-GiTsC0JKczn6qDU4vaeY",
  authDomain: "nepal-pm-voting.firebaseapp.com",
  databaseURL: "https://nepal-pm-voting-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nepal-pm-voting",
  storageBucket: "nepal-pm-voting.firebasestorage.app",
  messagingSenderId: "688396191682",
  appId: "1:688396191682:web:8e140e2ff87cacb526785b",
  measurementId: "G-59GKJ2NS6C"
};
firebase.initializeApp(firebaseConfig);

// Initialize votes if not existing
if (!localStorage.getItem("votes")) {
    const initialVotes = { balen:0, harka:0, oli:0, gagan:0 };
    localStorage.setItem("votes", JSON.stringify(initialVotes));
}

// Display votes with animated bars
function displayVotes() {
    const votes = JSON.parse(localStorage.getItem("votes"));
    const balen = votes.balen || 0;
    const harka = votes.harka || 0;
    const oli = votes.oli || 0;
    const gagan = votes.gagan || 0;
    const total = balen + harka + oli + gagan;

    function updateBar(id, count, color) {
        const perc = total ? Math.round((count / total) * 100) : 0;
        const bar = document.getElementById(id);
        bar.style.width = perc + "%";
        bar.style.background = color;
        bar.innerText = count + " (" + perc + "%)";
    }

    updateBar("balenBar", balen, "linear-gradient(to right, #3b82f6, #60a5fa)");
    updateBar("harkaBar", harka, "linear-gradient(to right, #000000, #434343)");
    updateBar("oliBar", oli, "linear-gradient(to right, #ef4444, #f87171)");
    updateBar("gaganBar", gagan, "linear-gradient(to right, #22c55e, #4ade80)");

    document.getElementById("totalVotes").innerText = "Total Votes: " + total;

    document.querySelectorAll(".vote-box").forEach(box => box.style.display = "block");
}

displayVotes();

// Voting function with confetti and Firebase log
function vote(candidate) {
    if (localStorage.getItem("voted")) {
        document.getElementById("message").innerText = "You have already voted!";
        disableButtons();
        return;
    }

    let votes = JSON.parse(localStorage.getItem("votes"));
    votes[candidate]++;
    localStorage.setItem("votes", JSON.stringify(votes));
    localStorage.setItem("voted", "true");

    document.getElementById("message").innerText = "Thank you for voting!";
    displayVotes();
    disableButtons();

    // 🎉 Confetti animation
    if (window.confetti) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    // Log vote to Firebase
    const voteLog = {
        candidate: candidate,
        time: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            voteLog.location = { lat: position.coords.latitude, lon: position.coords.longitude };
            sendVoteLog(voteLog);
        }, () => sendVoteLog(voteLog));
    } else {
        sendVoteLog(voteLog);
    }
}

// Send vote log to Firebase
function sendVoteLog(log) {
    const logsRef = firebase.database().ref('voteLogs');
    logsRef.push(log)
        .then(() => console.log("Vote logged:", log))
        .catch(err => console.error("Error logging vote:", err));
}

// Disable all buttons
function disableButtons() {
    document.querySelectorAll("button").forEach(btn => btn.disabled = true);
}

// Disable buttons if already voted
if (localStorage.getItem("voted")) disableButtons();

