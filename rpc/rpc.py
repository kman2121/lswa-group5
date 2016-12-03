import SimpleXMLRPCServer
import numpy as np
import cv2
from PIL import Image
import urllib

cascadepath = 'haarcascade_frontalface_default.xml'

def processFaces(URL):
    res = urllib.urlopen(URL)
    img = np.asarray(bytearray(res.read()), dtype="uint8")
    img = cv2.imdecode(img, cv2.IMREAD_COLOR)
    cascade = cv2.CascadeClassifier(cascadepath)
    if(img is None):
        return "Failed to load image"
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        x =  cascade.detectMultiScale(gray, 1.3, 5)
        return np.array_str(x)

server = SimpleXMLRPCServer.SimpleXMLRPCServer(("localhost", 8080))
server.register_function(processFaces, 'face')
print('Serving XML-RPC on localhost port 8080')
server.serve_forever()
