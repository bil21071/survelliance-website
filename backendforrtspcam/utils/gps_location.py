import serial
import time
import requests
import re

def get_gps_coordinates(port='COM5', baudrate=9600):
    gps_serial = serial.Serial(port, baudrate, timeout=1)
    time.sleep(2)

    latitude = None
    longitude = None
    lat_line = ""
    lon_line = ""

    while True:
        try:
            line = gps_serial.readline().decode('utf-8', errors='ignore').strip()
            if "Latitude" in line:
                lat_line = line
            elif "Longitude" in line:
                lon_line = line
                latitude = float(re.search(r"[-+]?\d*\.\d+", lat_line).group())
                print(f"{latitude}")
                longitude = float(re.search(r"[-+]?\d*\.\d+", lon_line).group())
                print(f"{longitude}")
                gps_serial.close()
                return latitude, longitude
        except:
            continue

def get_location_from_osm(lat, lon):
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18&addressdetails=1"
    headers = {'User-Agent': 'DetectionSystem/1.0'}  # Important for Nominatim
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data.get("display_name", "Unknown Location")
    return "Unknown Location"


lat, lon = get_gps_coordinates()
location = get_location_from_osm(lat, lon)
print(f"this is the {location}")


