// Function to hash the access key
async function hashKey(key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Function to check balance
function getUserBalance() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        return userData.balance || 0; // Return balance or 0 if not set
    }
    return 0; // Default balance is 0
}

// Login function
async function login() {
    const enteredKey = document.getElementById('accessKey').value;
    const hashedEnteredKey = await hashKey(enteredKey);
    const storedHashedKey = localStorage.getItem('userHashedAccessKey');

    if (hashedEnteredKey === storedHashedKey && storedHashedKey) {
        alert("Login successful!");

        // Fetch user's balance (assuming balance is stored with the access key)
        const balance = getUserBalance();
        alert(`Your balance is: ${balance}`);

        // Send the access key to Google Apps Script to be recorded in the Google Sheet
        const response = await fetch(`https://script.google.com/macros/s/AKfycbzyzRoOkjTthXgBrgLZVX6C2vamhOjascdoWhKf3w/dev?accessKey=${enteredKey}`);
        const result = await response.text();  // Response from Apps Script
        console.log(result); // Log response to check if access key is stored correctly

        // Redirect to homepage (or any other page)
        window.location.href = "https://sites.google.com/view/gamers-win/home"; 
    } else {
        alert("Invalid Access Key. Please try again or create a new key.");
    }
}

// Function to create an access key
async function createAccessKey() {
    const newKey = prompt("Enter a unique access key:");
    if (newKey) {
        const hashedKey = await hashKey(newKey);
        localStorage.setItem('userHashedAccessKey', hashedKey);

        // Initialize user data with balance (you can modify balance logic here)
        const userData = {
            accessKey: hashedKey,
            balance: 1000 // You can set the starting balance here
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        alert("Access Key created successfully! You can now use it to log in.");
    } else {
        alert("Access Key creation canceled.");
    }
}

// Event listeners for buttons
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('createKeyLink').addEventListener('click', createAccessKey);
