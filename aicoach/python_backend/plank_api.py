from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import mediapipe as mp
import numpy as np
import time

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

@app.route('/upload-plank', methods=['POST'])
def upload_plank_video():
    if 'video' not in request.files:
        return jsonify({'message': 'No video file provided'}), 400

    video = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    # Pose detection setup
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)

    plank_started = False
    start_time = 0
    total_plank_time = 0
    bad_posture_reasons = set()
    bad_posture_frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (640, 480))
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(rgb)

        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark

            sh = [lm[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, lm[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            hip = [lm[mp_pose.PoseLandmark.RIGHT_HIP.value].x, lm[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            knee = [lm[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, lm[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            ankle = [lm[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, lm[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

            torso_angle = get_angle(sh, hip, knee)
            hip_angle = get_angle(sh, hip, ankle)
            leg_angle = get_angle(hip, knee, ankle)

            is_good_posture = (
                torso_angle > 145 and
                hip_angle > 140 and
                leg_angle > 155
            )

            if is_good_posture:
                if not plank_started:
                    plank_started = True
                    start_time = time.time()
                    bad_posture_frames = 0
                    bad_posture_reasons.clear()
            else:
                if plank_started:
                    if torso_angle < 130 and hip_angle < 130 and leg_angle < 130:
                        plank_started = False
                        end_time = time.time()
                        total_plank_time += end_time - start_time
                    else:
                        bad_posture_frames += 1
                        if torso_angle < 145:
                            bad_posture_reasons.add("⚠️ Hip too low → May cause lower back strain.")
                        if hip_angle < 140:
                            bad_posture_reasons.add("⚠️ Poor hip alignment → Risk of hip flexor stress.")
                        if leg_angle < 155:
                            bad_posture_reasons.add("⚠️ Bent knees → Less core activation and improper form.")

    cap.release()
    pose.close()

    if plank_started:
        total_plank_time += time.time() - start_time

    result_data = {
        'message': 'Video processed successfully.',
        'plank_duration_sec': round(total_plank_time, 2),
        'bad_posture_frames': bad_posture_frames,
        'warnings': list(bad_posture_reasons)
    }

    return jsonify(result_data)

if __name__ == '__main__':
    app.run(debug=True)
