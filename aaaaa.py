import os

path = './src/images/products/'

for file in os.listdir(path):
    os.rename(path + file, path + file.lower())

then = os.listdir(path)
print(then)
