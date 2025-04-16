import firebase_admin
from firebase_admin import credentials, db


# Initialize Firebase app only once
if not firebase_admin._apps:
    cred = credentials.Certificate("C:/Users/Hp/Desktop/NeuraVision.Ai-master/survelliance website/backendforrtspcam/surveilliance-website-firebase-adminsdk-fbsvc-a4828af8b7.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://surveilliance-website-default-rtdb.firebaseio.com/'
    })

# Firebase DB reference
db_ref = db.reference("/") # This is the root of your Realtime DB
data={'user':{'user':{'firstname':'Ali'}}}
db_ref.set(data)
