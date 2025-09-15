# NotJustChillar – Personal Finance & Budget Tracker App
A React Native finance app to track income, expenses, budgets, and financial goals in a secure, organized, and visually appealing way. Built with Firebase backend and strong encryption for sensitive user data.

# Features
Track Income & Expenses – Add, edit, and delete transactions <br>
Visual Analytics – Charts showing expense trends, category breakdowns, and monthly comparisons. <br>
Secure Storage – AES-256 encryption & Firebase for secure storage of user data. <br>
Recent Activity & History – See transactions day-wise, similar to Google Pay. <br>
Extensible & Scalable – Designed for real-world production use, modular architecture. <br>

# Tech Stack
Frontend: React Native, Expo <br>
Backend & Database: Firebase (Auth + Firestore) <br>
Storage & Security: AES-256, TLS encryption <br>
Charts & UI: React Native Charts <br>

# Screenshots / Demo

Home Screen
<img src="assets/screenshots/home.png" alt="Home Screen" width="300" height="300/>

### Budget Page
![Budget Page](assets/screenshots/budget.png)

### Expense Tracker
![Expense Tracker](assets/screenshots/expense.png)

### History Page
![History Page](assets/screenshots/history.png)

### Goals & Auto Savings
![Goals Page](assets/screenshots/goals.png)


# Setup & Installation

1. Clone the repository <br>
git clone https://github.com/yourusername/NotJustChillar.git <br>
cd NotJustChillar <br>


2. Install dependencies
npm install


3. Create .env file in root <br>
FIREBASE_API_KEY=your_api_key <br>
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com <br>
FIREBASE_PROJECT_ID=your_project_id <br>
FIREBASE_STORAGE_BUCKET=your_project.appspot.com <br>
FIREBASE_MESSAGING_SENDER_ID=your_sender_id <br>
FIREBASE_APP_ID=your_app_id <br>


3. Start the app <br>
npm start<br>
Expo will launch Metro Bundler. Scan the QR code to run on your mobile device.<br>
