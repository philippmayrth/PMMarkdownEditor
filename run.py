import os
import sys

if sys.platform == "darwin":
    os.system("$(pwd)/electron-v1.8.2-beta.4-mas-x64/Electron.app/Contents/MacOS/Electron --debug=5858 $(pwd)/Code")
elif os.system == "nt":
    raise NotImplementedError()
elif sys.platform == "unix":
    raise NotImplementedError()
else:
    raise Exception("Unknown OS - dont know how to run here.")
