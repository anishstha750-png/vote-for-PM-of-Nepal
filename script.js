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

// Display votes on page
function displayVotes() {
    const votes = JSON.parse(localStorage.getItem("votes"));
    document.getElementById("balen").innerText = votes.balen;
    document.getElementById("harka").innerText = votes.harka;
    document.getElementById("oli").innerText = votes.oli;
    document.getElementById("gagan").innerText = votes.gagan;
}

displayVotes();

// Voting function
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