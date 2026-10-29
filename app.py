"""Tiny Python server for the EnergySaver beginner project."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

# Serve this project's folder, so no extra Python packages are needed.
PROJECT_FOLDER = Path(__file__).resolve().parent
os.chdir(PROJECT_FOLDER)

if __name__ == "__main__":
    host, port = "127.0.0.1", 8000
    print(f"EnergySaver is running at http://{host}:{port}")
    print("Keep this terminal open while using the website. Press Ctrl+C to stop.")
    ThreadingHTTPServer((host, port), SimpleHTTPRequestHandler).serve_forever()
