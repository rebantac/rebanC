import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) { // loading the three dots when the bots finds the answer
    element.textContent = 'RebanC is thinking';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === 'RebanC is thinking....') {
            element.textContent = 'RebanC is thinking';
        }
    }, 300);
}

// this function ensures that the answer is typed letter-by-letter and not as a whole block
function typeText (element, text) {
    let index = 0; // index of character in 'text'

    let interval = setInterval(() => {
        if(index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else { // when all the text is written
            clearInterval(interval);
        }
    }, 20);
}

// generating message for every single message to successfully map over them
function generateUniqueId() {
    const timestamp = Date.now(); // date is always unique
    const randomNumber = Math.random(); // to make it more unique
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

// each block of qn and ans
function chatStripe (isAi, value, uniqueId) {
    return (
        `
            <div class="wrapper ${isAi && 'ai'}">
                <div class="chat">
                    <div class="profile">
                        <img 
                            src="${isAi ? bot : user}"
                            alt="${isAi ? 'bot' : 'user'}"
                        />
                    </div>

                    <div class="message" id=${uniqueId}> ${value} </div>
                </div>
            </div>
        `
    )
}

const handleSubmit = async (event) => {
    event.preventDefault(); // prevents the browser from refreshing
    
    const data = new FormData(form);

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    // bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight; // puts the new msg in view
    
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // fetch data from server -> bot's response
    const response = await fetch('https://rebanc.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();

        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {// '13' represents the 'enter' key
        handleSubmit(event);
    }
})
