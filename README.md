# 🧩 8 Puzzle Pro

An interactive **8-Puzzle game with AI solving capability** built using **Flask (Python) and JavaScript**.
The project allows users to play the puzzle, track their performance, and automatically solve the puzzle using the **A* Search Algorithm**.

---

## 🎮 Features

* 🧠 AI Solver using A* Algorith
* 🎯 Multiple **Difficulty Levels**

  * Easy
  * Medium
  * Hard
  * Expert
* ⏱ **Live Timer**
* 👣 **Step Counter**
* ↩️ **Undo Moves**
* 🔄 **Restart Puzzle**
* 🤖 **Auto Solve Feature**
* 🏆 **Leaderboard System**
* 🎉 **Win Screen with Results**
* ⌨️ **Keyboard Controls**
* 📱 **Responsive UI**

---

## 🧠 Algorithm Used

The puzzle is solved using the **A* (A-Star) Search Algorithm** with the **Manhattan Distance heuristic**.

### Heuristic Function

Manhattan Distance:

|x1 - x2| + |y1 - y2|

This ensures the solver finds the **optimal shortest solution path**.

---

## 🏗 Project Structure

```
8Puzzle_Game
│
├── app.py
├── leaderboard.json
│
├── templates
│   └── index.html
│
└── static
    ├── script.js
    └── style.css
```
---

## ⚙️ Technologies Used

* **Python (Flask)**
* **JavaScript**
* **HTML5**
* **CSS3**
* **A* Search Algorithm**

---

## 🚀 How to Run Locally

### 1️⃣ Clone the Repository


git clone https://github.com/krishna041125/8Puzzle_Game.git


### 2️⃣ Navigate to the Folder


cd 8Puzzle_Game


### 3️⃣ Install Flask


pip install flask


### 4️⃣ Run the Application


python app.py


### 5️⃣ Open in Browser


http://127.0.0.1:5000


---

## 🎯 How to Play

1. Select a difficulty level.
2. Enter your name.
3. Click tiles next to the empty space to move them.
4. Arrange the numbers **1 → 8** in order.
5. Try solving with the **minimum steps and time**.

---

## 📊 Leaderboard

The game stores the **top 10 best scores** based on:

* Minimum Steps
* Minimum Time

Scores are saved in:


leaderboard.json


---

## 💡 Future Improvements

* AI **Hint System**
* Tile **Sliding Animation**
* **Multiplayer Mode**
* Online **Leaderboard Database**
* Mobile App Version

---

## 👨‍💻 Author

**Krishna Gupta**,
B.Tech, Computer Science,
KIIT University

---

## 📜 License

This project is for **educational purposes**.
