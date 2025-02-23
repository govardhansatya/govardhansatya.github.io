from flask import Flask, jsonify, request
import threading
import subprocess
import time
import os
import signal

app = Flask(__name__, template_folder="templates")

process = None  # To store the virtual mouse process
thread = None   # To store the background thread
running = False # To track the script's running state

def run_virtual_mouse():
    """Runs the virtual mouse script in a separate thread."""
    global process, running
    running = True
    process = subprocess.Popen(["python", "virtual_mouse.py"])  # Adjust filename as needed
    process.wait()  # Wait for process to finish
    running = False

@app.route('/start', methods=['POST'])
def start():
    global thread, running
    if not running:  # Start only if not already running
        thread = threading.Thread(target=run_virtual_mouse)
        thread.start()
        return jsonify({"success": True, "message": "Virtual Mouse Started"})
    return jsonify({"success": False, "message": "Already Running"})

@app.route('/stop', methods=['POST'])
def stop():
    global process, running
    if running and process:
        os.kill(process.pid, signal.SIGTERM)  # Terminate the process
        running = False
        return jsonify({"success": True, "message": "Virtual Mouse Stopped"})
    return jsonify({"success": False, "message": "Already Stopped"})

@app.route('/')
def home():
    return "Virtual Mouse Server is Running"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

