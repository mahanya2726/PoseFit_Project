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
    radians = np.arccos(
        np.clip(np.dot(a - b, c - b) / (np.linalg.norm(a - b) * np.linalg.norm(c - b)), -1.0, 1.0)
    )
    return np.degrees(radians)

@app.route('/upload-lunges', methods=['POST'])
def upload_lunge_video():
    if 'video' not in request.files:
        return jsonify({'message': 'No video file provided'}), 400

    video = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)

    count = 0
    good_reps = 0
    bad_reps = 0
    direction = 0  # 0 - going down, 1 - coming up

    posture_issues = {
        "knee_not_90": 0,
        "torso_not_straight": 0
    }

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (640, 480))
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb)

        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            try:
                # Use the leg that is lower on screen
                l_knee_y = lm[mp_pose.PoseLandmark.LEFT_KNEE.value].y
                r_knee_y = lm[mp_pose.PoseLandmark.RIGHT_KNEE.value].y

                if l_knee_y > r_knee_y:
                    # Left leg forward
                    sh = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                    hip = [lm[mp_pose.PoseLandmark.LEFT_HIP.value].x, lm[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                    knee = [lm[mp_pose.PoseLandmark.LEFT_KNEE.value].x, lm[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                    ankle = [lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
                else:
                    # Right leg forward
                    sh = [lm[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, lm[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                    hip = [lm[mp_pose.PoseLandmark.RIGHT_HIP.value].x, lm[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
                    knee = [lm[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, lm[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                    ankle = [lm[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, lm[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

                knee_angle = get_angle(hip, knee, ankle)       # Should be close to 90°
                torso_angle = get_angle(sh, hip, knee)         # Should be ~180°

                if knee_angle < 100 and direction == 0:
                    direction = 1

                    bad_knee = knee_angle < 70
                    bad_torso = torso_angle < 160

                    if bad_knee:
                        posture_issues["knee_not_90"] += 1
                    if bad_torso:
                        posture_issues["torso_not_straight"] += 1

                    if bad_knee or bad_torso:
                        bad_reps += 1
                    else:
                        good_reps += 1

                if knee_angle > 160 and direction == 1:
                    count += 1
                    direction = 0

            except:
                continue

    cap.release()
    pose.close()

    # Warnings
    warnings = []
    if posture_issues["knee_not_90"] > 0:
        warnings.append("⚠️ Knee not bent enough → Try achieving a deeper lunge near 90°.")
    if posture_issues["torso_not_straight"] > 0:
        warnings.append("⚠️ Torso leaned forward → Keep your upper body upright.")

    if count == 0:
        return jsonify({
            'message': 'No valid lunges detected.',
            'total_lunges': 0,
            'good_lunges': 0,
            'bad_lunges': 0,
            'warnings': ["❌ No valid lunge movement detected. Please ensure full-body visibility."]
        })

    return jsonify({
        'message': 'Lunge video processed successfully.',
        'total_lunges': count,
        'good_lunges': good_reps,
        'bad_lunges': bad_reps,
        'warnings': warnings
    })

if __name__ == '__main__':
    app.run(debug=True)
