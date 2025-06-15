import firebase_admin
from firebase_admin import credentials, db


# Initialize Firebase app only once
if not firebase_admin._apps:
    cred = credentials.Certificate("C:/Users/Hp/Desktop/NeuraVision.Ai-master/survelliance website/rveilx-firebase-adminsdk-fbsvc-265ebf12f5.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://rveilx-default-rtdb.asia-southeast1.firebasedatabase.app/'
    })

# Firebase DB reference
db_ref = db.reference("/") # This is the root of your Realtime DB
