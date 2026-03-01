// Initialize votes if not existing
if (!localStorage.getItem("votes")) {
    const initialVotes = {
        balen: 0,
        harka: 0,
        oli: 0,
        gagan: 0
    };
    localStorage.setItem("votes", JSON.stringify(initialVotes));
}

// Display votes with animated bars
function displayVotes() {
    const votes = JSON.parse(localStorage.getItem("votes"));
    const total = votes.balen + votes.harka + votes.oli + votes.gagan;

    // Helper to update bar width & text
    function updateBar(id, count, color) {
        const percentage = total ? Math.round((count / total) * 100) : 0;
        const bar = document.getElementById(id);
        bar.style.width = percentage + "%";
        bar.style.background = color;
        bar.innerText = count + " (" + percentage + "%)";
    }

    updateBar("balenBar", votes.balen, "linear-gradient(to right, #3b82f6, #60a5fa)");
    updateBar("harkaBar", votes.harka, "linear-gradient(to right, #000000, #434343)");
    updateBar("oliBar", votes.oli, "linear-gradient(to right, #ef4444, #f87171)");
    updateBar("gaganBar", votes.gagan, "linear-gradient(to right, #22c55e, #4ade80)");
}

displayVotes();

// Voting function with confetti
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
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Disable all buttons
function disableButtons() {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Disable buttons if already voted
if (localStorage.getItem("voted")) {
    disableButtons();
}

// Show vote bars initially
document.querySelectorAll(".vote-box").forEach(box => box.style.display = "block");
