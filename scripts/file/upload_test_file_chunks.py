import requests
import time
import os

# Replace these with actual values
session_id = "oo3tZoSELaW_KepoNcAOvBwc3plr04hN"
file_path = "./test_docs/Les.Misérables.2012.1080p.BrRip.x264.YIFY.mp4"

total_sequences = 1179

file_id = "65b2b350f9c8a36aa00fa448"
folder_id = "65b1b0379c02befc19893548"

for sequence in range(1, total_sequences + 1):
    chunk_name = f"_part_{sequence}"
    chunk_path = f"{file_path}{chunk_name}"

    # Check if file chunk exists
    if not os.path.isfile(chunk_path):
        print(f"Chunk file not found for sequence {sequence}!")
        continue

    url = f"http://localhost:4000/api/v1/file/{folder_id}/{file_id}/upload-chunk"

    # Headers
    headers = {
        "sessionid": session_id
    }

    # Open the chunk file in binary read mode
    with open(chunk_path, "rb") as file_to_upload:
        # Body
        files = {
            "chunkNumber": (None, str(sequence)),
            "totalChunks": (None, str(total_sequences)),
            "file": file_to_upload
        }

        response = requests.post(url, headers=headers, files=files)
        print(f"Sequence {sequence}: {response.status_code} - {response.text}")
        print(response.json())
        time.sleep(0.5)