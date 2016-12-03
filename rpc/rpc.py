import SimpleXMLRPCServer
import numpy as np
import cv2
from PIL import Image
import urllib

def processFaces(URL):
    res = urllib.urlopen(URL)
	img = np.asarray(bytearray(res.read()), dtype="uint8")
	img = cv2.imdecode(image, cv2.IMREAD_COLOR)
    cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    if(img is None):
        return "Image did not load"
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return cascade.detectMultiScale(
                gray,
                scaleFactor = 1.15,
                minNeighbors = 5,
                minSize = (30, 30),
                flags = cv2.cv.CV_HAAR_SCALE_IMAGE
              )

def test(msg):
    return msg

server = SimpleXMLRPCServer.SimpleXMLRPCServer(("0.0.0.0", 80))
server.register_function(processFaces, 'face')
server.register_function(test, 'test')
print('Serving XML-RPC on localhost port 80')
server.serve_forever()
