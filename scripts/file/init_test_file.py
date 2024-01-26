import mimetypes
import requests
import os

file_path = "./test_docs/Les.Misérables.2012.1080p.BrRip.x264.YIFY.mp4"
session_id = "oo3tZoSELaW_KepoNcAOvBwc3plr04hN"
folder_id = "65b1b0379c02befc19893548"


def split_file(file_path, chunk_size_mb):
    chunk_size = chunk_size_mb * 1024 * 1024 # Convert to bytes
    part_number = 1

    with open(file_path, "rb") as file:
        chunk = file.read(chunk_size)
        while chunk:
            with open(f"{file_path}_part_{part_number}", 'wb') as chunk_file:
                chunk_file.write(chunk)
            part_number += 1
            chunk = file.read(chunk_size)

split_file(file_path, 2) # 2 MB chunks

def initialize_file_upload(url, folder_id, file_path, session_id):
    file_name, file_type, total_size = get_file_details(file_path)
    endpoint = f"{url}/{folder_id}/initialize"
    headers = {"sessionid": session_id}
    data = {
        'name': file_name,
        'fileType': file_type,
        'totalBufferSize': total_size
    }
    response = requests.post(endpoint, json=data, headers=headers)
    return response.json()

def get_file_details(file_path):
    file_name = os.path.basename(file_path)
    file_type = mimetypes.guess_type(file_path)[0]
    total_size = os.path.getsize(file_path)
    return file_name, file_type, total_size

url = "http://localhost:4000/api/v1/file"

response_data = initialize_file_upload(url, folder_id, file_path, session_id)
print(response_data)