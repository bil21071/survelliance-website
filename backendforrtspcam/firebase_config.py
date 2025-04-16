import firebase_admin
from firebase_admin import credentials, firestore

# Path to your downloaded service account JSON
cred = credentials.Certificate("C:/Users/Hp/Desktop/NeuraVision.Ai-master/survelliance website/backendforrtspcam/surveilliance-website-firebase-adminsdk-fbsvc-ad3a575308.json")

firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()
