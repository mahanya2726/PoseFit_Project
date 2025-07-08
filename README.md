# 🏋️‍♀️ PoseFit – Smart Fitness Form Evaluator

Welcome to **PoseFit**, a cutting-edge computer vision fitness app that provides **real-time feedback** on exercise form using **pose estimation**. 

---

## ✨ Features

✅ Detects and evaluates:
- Squats  
- Lunges  
- Pushups  
- Planks

## 🚀 How It Works

1. The user selects their **preferred workout** (e.g., Squat, Pushup, etc.) on the web interface.
2. A **countdown timer** appears to give the user time to get ready.
3. The app then **automatically records the workout** using the webcam.
4. Once the video is captured, it is **automatically sent to the backend (Flask)**.
5. The backend uses **MediaPipe** to analyze the body posture and movements.
6. It calculates:
   - The number of **total**, **good**, and **bad reps**
   - Specific **posture issues**
7. Results are shown on a clean, interactive UI.




## 🧠 Tech Stack

| Frontend        | Backend            | Computer Vision      | 
|----------------|--------------------|----------------------|
| Next.js         | Flask               | MediaPipe, OpenCV    |
| Tailwind CSS    | Python              | NumPy, CV2           | 
| Clerk Auth      | REST APIs           |                      |

---

## 📂 Project Structure

```
aicoach/
├── src/                   # Next.js frontend
│   └── app/
│       └── session/       # Exercise pages (Squat, Plank, Pushup, Lunge)
├── python_backend/
│   ├── squat_api.py            # Flask entrypoint
│   ├── pushup_api.py
│   ├── lunge_api.py
│   ├── plank_api.py
│   └── uploads/           # Uploaded video storage
└── requirements.txt
```

---

## 🚀 Getting Started (Locally)

### 1. Clone the repository

```bash
git clonehttps://github.com/mahanya2726/PoseFit_Project.git
cd ai-coach
```

### 2. Run the Next.js Frontend

```bash
cd ../  # go to aicoach/
npm install
npm run dev
```

### 3. Start the Python Backend (in seperate terminal)
Create your virtual environment 

```bash
cd aicoach/python_backend
pip install -r requirements.txt
python squat_api.py   # or pushup_api.py, etc
```



---




## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
