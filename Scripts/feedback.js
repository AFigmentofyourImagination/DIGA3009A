document.addEventListener('DOMContentLoaded', function() {
    //DOM elements i should manipulate in the feedback system
    const feedbackForm = document.getElementById("feedbackForm");
    const confirmMessage = document.getElementById("confirmMessage");
    const newFeedbackBtn = document.getElementById("newFeedback");
    const totalSubmissionsE1 = document.getElementById("totalSubmissions");
    const recentFeedbackE1 = document.getElementById("recentFeedback");

    //initialize feedback storage
    let feedbackData = JSON.parse(localStorage.getItem('feedbackData')) || {
        submissions: [],
        count: 0
    };

    //update stats & recent feedback display
    updateFeedbackDisplay();

    //form submission handler
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();

        //get form data
        const formData = new FormData(feedbackForm);
        const feedback = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            comments: formData.get('comments'),
            timestamp: new Date().toISOString
        };

        //save feedback
        saveFeedback(feedback);

        //show confirmation message
        feedbackForm.classList.add('hidden');
        confirmMessage.classList.remove('hidden');

        //update display
        updateFeedbackDisplay();
    });

    //save feedback data
    function saveFeedback(feedback) {
        //add to submissions array
        feedbackData.submissions.unshift(feedback);

        //keep only the most recent 10 submissions
        if (feedbackData.submissions.length > 10) {
            feedbackData.submissions = feedbackData.submissions.slice(0, 10);
        }

        //update totals
        feedbackData.count += 1;

        //save to local storage
        localStorage.setItem('feedbackData', JSON.stringify(feedbackData));
    }

    //update feedback display
    function updateFeedbackDisplay() {
        //update stats
        totalSubmissionsE1.textContent = feedbackData.count;

        //clear recent feedback
        recentFeedbackE1.innerHTML = '';

        //add recent feedback items
        if (feedbackData.submissions.length === 0) {
            recentFeedbackE1.innerHTML = '<p>No feedback submissions yet.</p>';
        } 
        else {
            feedbackData.submissions.forEach(item => {
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item';

                const date = new Date(item.timestamp).toLocaleDateString();

                feedbackItem.innerHTML = `
                <h4> 
                    <span>${item.name} - ${item.category}</span> 
                </h4> 
                <p>${item.comments || 'No additional comments.'}</p> 
                <small>${date}</small>
                `;

                
            });
        }
    }
    //function to clear all feedback data (for testing)
    window.clearFeedbackData = function() {
        feedbackData = {
            submissions: [],
            count: 0
        };
        localStorage.removeItem('feedbackData');
        updateFeedbackDisplay();
    };
});