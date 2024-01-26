import requests
from urllib.parse import unquote

# URL y ID del archivo
file_id = "65b2b350f9c8a36aa00fa448"
url = f"http://localhost:4000/api/v1/file/{file_id}/download"

# Iniciar la descarga con stream
response = requests.get(url, stream=True)

# Extraer el nombre del archivo del encabezado Content-Disposition
if "Content-Disposition" in response.headers:
    content_disposition = response.headers['Content-Disposition']
    file_name = content_disposition.split('filename=')[1]
    if file_name.startswith('"') and file_name.endswith('"'):
        file_name = file_name[1:-1]
    file_name = unquote(file_name)  # Decodificar URL encoding si es necesario
else:
    # Si el nombre del archivo no está en el encabezado, usar un nombre por defecto
    file_name = f"default_filename"

# Ruta de salida
output_path = f"./test_results/{file_name}"

# Verificar si la solicitud fue exitosa
if response.status_code == 200:
    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192): 
            # Escribir los datos en el archivo en partes
            if chunk: 
                f.write(chunk)
        print("Descarga completada con éxito.")
else:
    print(f"Error ocurrido: {response.status_code} - {response.text}")

# Manejar excepciones y errores de red según sea necesario
