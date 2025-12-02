# 🎓 UniTrack

**UniTrack ** is a responsive web application built using **React** and **Tailwind CSS** to help ** University** students manage and calculate their **GPA**, **CGPA**, and **attendance** in a simple and intuitive way.

> All calculations are done on the client side – no backend used to store data.

> All data stored locally on your device.

---

## 🚀 Features

### 📘 GPA Calculator
- Add subjects dynamically (starts with 3 by default)
- Input subject credit and grade
- Grades supported: `O`, `A+`, `A`, `B+`, `B`, `C`, `F`
- GPA calculated as:

GPA = sum of (grade point × credit) / total credits

- Grade-to-point mapping:
- `O = 10`, `A+ = 9`, `A = 8`, `B+ = 7`, `B = 6`, `C = 5`, `F = 0`

### 📚 CGPA Calculator
- Enter GPAs from past semesters
- Calculates CGPA as:

CGPA = total GPA sum / total semesters


### 🧮 Attendance Calculator
- Inputs:
- Credit (1–5)
- Hours attended
- Course type: Theory / Practical / Joint
- Calculates:
- Total hours
- Attendance %
- Allowable leave hours
- Logic:
- `Total Hours = credit × 15`
- If Practical or Joint → `Total Hours += 15`
- `Attendance % = (attended / total) × 100`
- `Max Leave = total − (0.75 × total)`

---

## 📱 Responsive Design

- Fully responsive with **Tailwind CSS**
- Mobile and desktop friendly
- Clean and accessible UI

---

## 🛠 Tech Stack

- [React](https://reactjs.org/) – JavaScript library for building UI
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Vite](https://vitejs.dev/) – Fast development server (optional but recommended)

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/NRJ900/UniTrack.git
cd unitrack-srm
```
2. Install Dependencies
```bash
npm install
```
3. Start the Dev Server
```bash
npm run dev
```
The app will be live at http://localhost:xxxx/

--- 

✅ Validation & Error Handling
Prevents empty inputs or invalid entries

Validates credit range (1–5)

Restricts grade inputs to valid SRM grades

---

📃 License
This project is licensed under the MIT License.

--- 

🙌 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change or improve.

---

📬 Feedback
If you find bugs or have suggestions, please open an issue or contact me via GitHub.
