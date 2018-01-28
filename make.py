import os
import sys
import shutil
import plistlib

buildDir = "Build"
codeDir = "Code"
finalAppName = "Markdown Editor"
CFBundleIdentifier = "de.philippmayr.markdowneditor"

def composeIcon():
    pass

def signMacApp():
    pass

def helper_renameMacApp(path, newName, theCFBundleIdentifier):
    oldAppName = os.path.basename(path)[:-4]
    
    pathMainAppInfoFile = os.path.join(path, "Contents", "Info.plist")
    infoData = None
    with open(pathMainAppInfoFile, "rb") as fp:
        infoData = plistlib.load(fp)
        infoData["CFBundleExecutable"] = finalAppName
        infoData["CFBundleDisplayName"] = finalAppName
        infoData["CFBundleName"] = finalAppName
        infoData["CFBundleIdentifier"] = theCFBundleIdentifier
    with open(pathMainAppInfoFile, "wb") as fp:
        plistlib.dump(infoData, fp)

    shutil.move(os.path.join(path, "Contents", "MacOS", oldAppName), os.path.join(path, "Contents", "MacOS", newName))
    shutil.move(os.path.join(path), os.path.join(os.path.dirname(path), newName+".app"))
    

def buildMacApp():
    if os.path.exists(buildDir):
        shutil.rmtree(buildDir)
    
    # create app and copy source code
    electronMacAppSource = os.path.join("electron-v1.8.2-beta.4-mas-x64", "Electron.app")
    shutil.copytree(electronMacAppSource, os.path.join(buildDir, "Electron.app"), symlinks=True)
    shutil.copytree(codeDir, os.path.join(buildDir, "Electron.app", "Contents", "Resources", "app"), symlinks=True)

    # Create icon and copy over
    os.system("iconutil -c icns Artwork/AppIcon.iconset")
    shutil.copy("Artwork/AppIcon.icns", os.path.join(buildDir, "Electron.app", "Contents", "Resources", "electron.icns"))

    # Rename the App
    pathAppContents = os.path.join(buildDir, "Electron.app", "Contents")
    shutil.move(os.path.join(pathAppContents, "MacOS", "Electron"), os.path.join(pathAppContents, "MacOS", "Electron"))

    # We will reenable this if its required to pass the App Store review otherwise just rename the main app. There might be "Electron ..." shown on some places in the Activity Monitor -- so what..
    #helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper EH.app"), finalAppName+" Helper EH", CFBundleIdentifier+".helperEH")
    #helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper NP.app"), finalAppName+" Helper NP", CFBundleIdentifier+".helperNP")
    helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper.app"), finalAppName+" Helper", CFBundleIdentifier+".helper")
    helper_renameMacApp(os.path.join(buildDir, "Electron.app"), finalAppName, CFBundleIdentifier)

    os.system("touch '"+buildDir+"/"+finalAppName+".app'") # whatever this does it makes the actual new icon display correctly in finder (invalidate chache?)
    

    # TODO: Sign app for mac app store.
    # This will sign the app for distribution outside of the Mac App Store
    os.system('electron-osx-sign "$(pwd)/Build/'+finalAppName+'.app" --platform=darwin --type=distribution')


if __name__ == "__main__":
    if sys.platform == "darwin":
        buildMacApp()

