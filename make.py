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
        infoData["CFBundleExecutable"] = newName
        infoData["CFBundleDisplayName"] = newName
        infoData["CFBundleName"] = newName
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

    # Copy over electron and chromium license files
    shutil.copy(os.path.join("electron-v1.8.2-beta.4-mas-x64", "LICENSES.chromium.html"), os.path.join(buildDir, "Electron.app", "Contents", "Resources", "LICENSES.chromium.html"))
    shutil.copy(os.path.join("electron-v1.8.2-beta.4-mas-x64", "LICENSE"), os.path.join(buildDir, "Electron.app", "Contents", "Resources", "LICENSE.electron.txt"))

    # Create icon and copy over
    os.system("iconutil -c icns Artwork/AppIcon.iconset")
    shutil.copy("Artwork/AppIcon.icns", os.path.join(buildDir, "Electron.app", "Contents", "Resources", "electron.icns"))

    # copy over the plist for the app
    shutil.copy("Mac-Info.plist", os.path.join(buildDir, "Electron.app", "Contents", "Info.plist"))

    # Copy over the file icon
    os.system("iconutil -c icns Artwork/File.iconset")
    shutil.copy("Artwork/File.icns", os.path.join(buildDir, "Electron.app", "Contents", "Resources", "File.icns"))

    # Rename the App
    pathAppContents = os.path.join(buildDir, "Electron.app", "Contents")
    shutil.move(os.path.join(pathAppContents, "MacOS", "Electron"), os.path.join(pathAppContents, "MacOS", "Electron"))

    # We will reenable this if its required to pass the App Store review otherwise just rename the main app. There might be "Electron ..." shown on some places in the Activity Monitor -- so what..
    helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper EH.app"), finalAppName+" Helper EH", CFBundleIdentifier+".helperEH")
    helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper NP.app"), finalAppName+" Helper NP", CFBundleIdentifier+".helperNP")
    helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper.app"), finalAppName+" Helper", CFBundleIdentifier+".helper")
    helper_renameMacApp(os.path.join(buildDir, "Electron.app"), finalAppName, CFBundleIdentifier)

    os.system("touch '"+buildDir+"/"+finalAppName+".app'") # whatever this does it makes the actual new icon display correctly in finder (invalidate chache?)
    

    # TODO: Sign app for mac app store.
    # This will sign the app for distribution outside of the Mac App Store
    os.system('electron-osx-sign "$(pwd)/Build/'+finalAppName+'.app" --platform=darwin --type=development')

    #os.system('electron-osx-sign "$(pwd)/Build/'+finalAppName+'.app" --platform=mas --type=distribution --entitlements=$(pwd)/entitlements.mas.plist')
    # aparently we have to create an installer and sign it with yet a nother singature (Mac Install Distribution) if we want to publish on the Mac App Store
    #os.system('productbuild --component "Build/'+finalAppName+'.app/" /Applications --sign "3rd Party Mac Developer Installer: Philipp Mayr (59925VM83D)" --product "Build/'+finalAppName+'.app/Contents/Info.plist" "Build/'+finalAppName+'.pkg"')

    print("IMPORTANT NOTE: Please use the Application Loader app with version 3.0 since newer versioins will fail to upload the resulting pkg file.")
    print()

if __name__ == "__main__":
    if sys.platform == "darwin":
        buildMacApp()

