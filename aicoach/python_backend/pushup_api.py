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

def get_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    return np.degrees(np.arccos(
        np.clip(np.dot(a - b, c - b) / (np.linalg.norm(a - b) * np.linalg.norm(c - b)), -1, 1)
    ))

@app.route('/upload-pushup', methods=['POST'])
def upload_pushup_video():
    if 'video' not in request.files:
        return jsonify({'message': 'No video file provided'}), 400

    video = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    # Mediapipe setup
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    count = good = bad = 0
    dir = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (640, 480))
        img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = pose.process(img)

        if not res.pose_landmarks:
            continue

        lm = res.pose_landmarks.landmark
        try:
            sh = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            el = [lm[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,    lm[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
            wr = [lm[mp_pose.PoseLandmark.LEFT_WRIST.value].x,    lm[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
            hip = [lm[mp_pose.PoseLandmark.LEFT_HIP.value].x,     lm[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            knee = [lm[mp_pose.PoseLandmark.LEFT_KNEE.value].x,   lm[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        except:
            continue

        elbow_angle = get_angle(sh, el, wr)
        torso_angle = get_angle(sh, hip, knee)

        if elbow_angle < 90 and dir == 0:
            dir = 1
            hip_bad = torso_angle < 160
            if hip_bad:
                bad += 1
            else:
                good += 1

        if elbow_angle > 160 and dir == 1:
            count += 1
            dir = 0

    cap.release()
    pose.close()

    return jsonify({
        'message': 'Video processed successfully.',
        'total_pushups': count,
        'good_pushups': good,
        'bad_pushups': bad
    })

if __name__ == '__main__':
    app.run(debug=True)
