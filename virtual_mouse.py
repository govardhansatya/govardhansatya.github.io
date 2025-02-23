import cv2
import mediapipe as mp
import pyautogui
import numpy as np
import time

# Initialize MediaPipe Hand Tracking
mpHands = mp.solutions.hands
hands = mpHands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7, max_num_hands=2)
mpDraw = mp.solutions.drawing_utils

# Screen size for mapping coordinates
screen_width, screen_height = pyautogui.size()
global prev_index_x
# Initialize camera
cap = cv2.VideoCapture(0)
prev_click_time = 0
prev_index_x = None

# Gesture State
gesture_mode = None
dragging = False
scrolling = False

# Function to map coordinates from camera to screen
def map_to_screen(x, y, frame_width, frame_height):
    screen_x = np.interp(x, [100, frame_width - 100], [0, screen_width])
    screen_y = np.interp(y, [100, frame_height - 100], [0, screen_height])
    return int(screen_x), int(screen_y)


while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        continue

    frame = cv2.flip(frame, 1)  # Flip for natural interaction
    frame_height, frame_width, _ = frame.shape
    imgRGB = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(imgRGB)

    if results.multi_hand_landmarks:
        hand_count = len(results.multi_hand_landmarks)

        for handLMs in results.multi_hand_landmarks:
            landmarks = [(int(lm.x * frame_width), int(lm.y * frame_height)) for lm in handLMs.landmark]

            if len(landmarks) >= 8:  # Ensure enough landmarks
                index_finger = landmarks[8]  # Index Finger Tip
                thumb = landmarks[4]  # Thumb Tip
                middle_finger = landmarks[12]  # Middle Finger Tip

                # Map to screen coordinates
                screen_x, screen_y = map_to_screen(index_finger[0], index_finger[1], frame_width, frame_height)

                # Move Cursor
                pyautogui.moveTo(screen_x, screen_y, duration=0.05)

                # Single Click Gesture (Index & Thumb Close)
                click_distance = np.hypot(index_finger[0] - thumb[0], index_finger[1] - thumb[1])
                if click_distance < 30:
                    current_time = time.time()
                    if current_time - prev_click_time > 0.5:  # Avoid multiple clicks
                        pyautogui.click()
                        prev_click_time = current_time

                # Drag Gesture (Index & Middle Finger Close)
                drag_distance = np.hypot(index_finger[0] - middle_finger[0], index_finger[1] - middle_finger[1])
                if drag_distance < 40 and not dragging:
                    pyautogui.mouseDown()
                    dragging = True
                elif drag_distance > 40 and dragging:
                    pyautogui.mouseUp()
                    dragging = False

                # Tab Switch Gesture (Swipe Left or Right)
                if prev_index_x is not None:
                    move_distance = index_finger[0] - prev_index_x
                    if move_distance > 50:
                        pyautogui.hotkey('ctrl', 'tab')  # Next Tab
                    elif move_distance < -50:
                        pyautogui.hotkey('ctrl', 'shift', 'tab')  # Previous Tab
                prev_index_x = index_finger[0]

            mpDraw.draw_landmarks(frame, handLMs, mpHands.HAND_CONNECTIONS)

    # Show Webcam Output
    cv2.imshow("Virtual Touchscreen", frame)

    # Exit on 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
