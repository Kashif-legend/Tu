// Function to hash the access key
async function hashKey(key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Login function
async function login() {
    const enteredKey = document.getElementById('accessKey').value;
    const hashedEnteredKey = await hashKey(enteredKey);
    const storedHashedKey = localStorage.getItem('userHashedAccessKey');

    if (hashedEnteredKey === storedHashedKey && storedHashedKey) {
        alert("Login successful!");
        window.location.href = "https://sites.google.com/view/gamers-win/home"; // Redirect to homepage
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
        alert("Access Key created successfully! You can now use it to log in.");
    } else {
        alert("Access Key creation canceled.");
    }
}

// Event listeners for buttons
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('createKeyLink').addEventListener('click', createAccessKey);
