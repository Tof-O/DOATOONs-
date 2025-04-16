import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBj8HeVOqquJd49bgp7TrZPg_FRJBDeiBg",
    authDomain: "doatoons.firebaseapp.com",
    projectId: "doatoons",
    storageBucket: "doatoons.firebasestorage.app",
    messagingSenderId: "778176872877",
    appId: "1:778176872877:web:7a1df7dd1c6f486277a124",
    measurementId: "G-DLS73GX39L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

let isLoggedIn = false;

// Check login state on page load
onAuthStateChanged(auth, user => {
    const loginOverlay = document.getElementById('loginOverlay');
    const registerOverlay = document.getElementById('registerOverlay');
    const profileContent = document.getElementById('profileContent');
    const profilePicture = document.getElementById('profilePicture');
    const userFullName = document.getElementById('userFullName');

    if (user) {
        isLoggedIn = true;
        loginOverlay.style.display = 'none';
        registerOverlay.style.display = 'none';
        profileContent.style.display = 'block';

        // Check if the user's email ends with @doatoons.com
        if (user.email && user.email.endsWith('@doatoons.com')) {
            window.location.href = '/DOATOONs-/profile/admin/';
        } else {
            // Display user info
            userFullName.textContent = user.displayName || 'Welcome';
            profilePicture.src = user.photoURL || 'https://via.placeholder.com/150?text=Profile';
        }
    } else {
        isLoggedIn = false;
        loginOverlay.style.display = 'flex';
        registerOverlay.style.display = 'none';
        profileContent.style.display = 'none';
    }
});

// Show registration overlay
window.showRegister = function() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('registerOverlay').style.display = 'flex';
};

// Show login overlay
window.showLogin = function() {
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('registerOverlay').style.display = 'none';
};

// Create account with email/password
window.createAccount = function() {
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!firstName || !lastName || !email || !password) {
        alert('Please fill in all required fields.');
        return;
    }

    // Construct full name
    const fullName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            // Update user profile with full name and default photo URL
            return updateProfile(user, {
                displayName: fullName,
                photoURL: 'https://via.placeholder.com/150?text=Profile'
            });
        })
        .then(() => {
            isLoggedIn = true;
            // Redirect based on email domain
            if (email.endsWith('@doatoons.com')) {
                window.location.href = '/DOATOONs-/profile/admin/';
            }
        })
        .catch(error => {
            alert(error.message);
        });
};

// Sign in with Google
window.signInWithGoogle = function() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(result => {
            const user = result.user;
            isLoggedIn = true;
            // Redirect based on email domain
            if (user.email && user.email.endsWith('@doatoons.com')) {
                window.location.href = '/DOATOONs-/profile/admin/';
            }
        })
        .catch(error => {
            alert(error.message);
        });
};

// Sign in with DOATOONs (redirect to admin page)
window.signInWithDoatoons = function() {
    window.location.href = '/DOATOONs-/profile/admin/';
};

// Sign in (for existing account)
window.signIn = function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                isLoggedIn = true;
                // Redirect based on email domain
                if (email.endsWith('@doatoons.com')) {
                    window.location.href = '/DOATOONs-/profile/admin/';
                }
            })
            .catch(error => {
                if (error.code === 'auth/user-not-found') {
                    alert('No account found. Please register first.');
                } else {
                    alert(error.message);
                }
            });
    } else {
        alert('Please enter both email and password.');
    }
};

// Sign out
window.signOut = function() {
    signOut(auth)
        .then(() => {
            isLoggedIn = false;
        })
        .catch(error => {
            alert(error.message);
        });
};

// Upload profile picture
window.uploadProfilePicture = function() {
    const fileInput = document.getElementById('profilePictureInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an image to upload.');
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to upload a profile picture.');
        return;
    }

    const storageRef = ref(storage, `profile-pictures/${user.uid}`);
    uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then(url => {
            return updateProfile(user, { photoURL: url });
        })
        .then(() => {
            document.getElementById('profilePicture').src = user.photoURL;
            alert('Profile picture updated successfully!');
        })
        .catch(error => {
            alert('Error uploading profile picture: ' + error.message);
        });
};

// Show edit profile form
window.showEditProfileForm = function() {
    const user = auth.currentUser;
    if (!user) return;

    const fullName = user.displayName || '';
    const names = fullName.split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 1] || '';
    const middleName = names.length > 2 ? names.slice(1, -1).join(' ') : '';

    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editMiddleName').value = middleName;
    document.getElementById('editLastName').value = lastName;
    document.getElementById('editProfileForm').style.display = 'flex';
};

// Update profile
window.updateProfile = function() {
    const firstName = document.getElementById('editFirstName').value;
    const middleName = document.getElementById('editMiddleName').value;
    const lastName = document.getElementById('editLastName').value;

    if (!firstName || !lastName) {
        alert('First and last names are required.');
        return;
    }

    const fullName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
    const user = auth.currentUser;

    updateProfile(user, { displayName: fullName })
        .then(() => {
            document.getElementById('userFullName').textContent = fullName;
            document.getElementById('editProfileForm').style.display = 'none';
            alert('Profile updated successfully!');
        })
        .catch(error => {
            alert('Error updating profile: ' + error.message);
        });
};

// Cancel edit profile
window.cancelEditProfile = function() {
    document.getElementById('editProfileForm').style.display = 'none';
};
