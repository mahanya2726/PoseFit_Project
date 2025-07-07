from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import mediapipe as mp
import numpy as np

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---- Function: Get Angle ----
def get_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arccos(
        np.clip(np.dot(a - b, c - b) / (np.linalg.norm(a - b) * np.linalg.norm(c - b)), -1.0, 1.0)
    )
    return np.degrees(radians)

@app.route('/upload-squat', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'message': 'No video file provided'}), 400

    video = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    # ---- Squat Analysis Logic Starts Here ----
    mp_pose = mp.solutions.pose
    mp_drawing = mp.solutions.drawing_utils
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)

    count = 0
    direction = 0
    good_reps = 0
    bad_reps = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb)

        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            try:
                hip = [lm[mp_pose.PoseLandmark.LEFT_HIP.value].x, lm[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                knee = [lm[mp_pose.PoseLandmark.LEFT_KNEE.value].x, lm[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                ankle = [lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
                shoulder = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            except:
                continue  # Skip frame if keypoints are missing

            knee_angle = get_angle(hip, knee, ankle)
            back_angle = get_angle(shoulder, hip, [hip[0], hip[1] - 0.1])

            if knee_angle < 100 and direction == 0:
                direction = 1
                if 85 <= knee_angle <= 100 and 15 <= back_angle <= 45:
                    good_reps += 1
                else:
                    bad_reps += 1
            if knee_angle > 150 and direction == 1:
                count += 1
                direction = 0

    cap.release()
    pose.close()

    return jsonify({
        'message': 'Video processed successfully.',
        'total_squats': count,
        'good_squats': good_reps,
        'bad_squats': bad_reps
    })

if __name__ == '__main__':
    app.run(debug=True)
