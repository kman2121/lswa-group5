import SimpleXMLRPCServer
import numpy as np
import cv2
from PIL import Image
import urllib

def processFaces(URL):
    res = urllib.urlopen(URL)
    img = np.asarray(bytearray(res.read()), dtype="uint8")
    img = cv2.imdecode(img, cv2.IMREAD_COLOR)
    cascade = cv2.CascadeClassifier('/home/rakan959/opencv/data/haarcascades/haarcascade_frontalface_default.xml')
    if(img is None):
        return "Image did not load"
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        x =  cascade.detectMultiScale(
                gray,
                1.3,
                5
              )
        return np.array_str(x)

def test(msg):
    return msg

server = SimpleXMLRPCServer.SimpleXMLRPCServer(("0.0.0.0", 80))
server.register_function(processFaces, 'face')
server.register_function(test, 'test')
print('Serving XML-RPC on localhost port 80')
server.serve_forever()
