from typing import *
from abc import ABC, abstractmethod
import os
import sys
import logging
import subprocess
import shutil
import plistlib


class Builder(ABC):
    @abstractmethod
    def build(self, codeDir: str, destinationDir: str, *, appName: str):
        pass

    @abstractmethod
    def getYarnExecutablePath(self) -> str:
        pass

    def obfuscateJavaScriptDirectory(self, codeDir: str, destinationDir: str):
        # Copy over all files (not just .js)
        shutil.copytree(codeDir, destinationDir)

        # Obfuscate .js files
        subprocess.call([
            self.getYarnExecutablePath(),
            "javascript-obfuscator",
            str(destinationDir),
            "--config",
            "js-obfuscator.json",
            "--exclude",
            "node_modules,bower_components"
        ])
        
        # Discard the not obfuscated .js files
        for root, dirs, files in os.walk(destinationDir):
            for name in files:
                obfuscatedFileExtention = "-obfuscated.js"
                if obfuscatedFileExtention in name:
                    fileNameOfNotObfuscatedFile = name.replace(obfuscatedFileExtention, ".js")
                    os.remove(os.path.join(root, fileNameOfNotObfuscatedFile))
                    newFileNameForObfuscatedFile = fileNameOfNotObfuscatedFile
                    shutil.move(
                        os.path.join(root, name),
                        os.path.join(root, newFileNameForObfuscatedFile)
                    )


class MacBuilder(Builder):
    def __init__(self):
        self.CFBundleIdentifier = None

    def getYarnExecutablePath(self) -> str:
        return "yarn"

    def build(self, codeDir: str, destinationDir: str, *, appName: str):
        buildDir = os.path.join(destinationDir, "macOS")
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
        self.helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper EH.app"), finalAppName+" Helper EH", self.CFBundleIdentifier+".helperEH")
        self.helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper NP.app"), finalAppName+" Helper NP", self.CFBundleIdentifier+".helperNP")
        self.helper_renameMacApp(os.path.join(buildDir, "Electron.app", "Contents", "Frameworks", "Electron Helper.app"), finalAppName+" Helper", self.CFBundleIdentifier+".helper")
        self.helper_renameMacApp(os.path.join(buildDir, "Electron.app"), finalAppName, self.CFBundleIdentifier)

        os.system("touch '"+buildDir+"/"+finalAppName+".app'") # whatever this does it makes the actual new icon display correctly in finder (invalidate chache?)

        # TODO: Sign app for mac app store.
        # This will sign the app for distribution outside of the Mac App Store
        #os.system('electron-osx-sign "$(pwd)/Build/'+finalAppName+'.app" --platform=darwin --type=development')

        os.system('electron-osx-sign "$(pwd)/Build/'+finalAppName+'.app" --platform=mas --type=distribution --entitlements=$(pwd)/entitlements.mas.plist')
        # aparently we have to create an installer and sign it with yet a nother singature (Mac Install Distribution) if we want to publish on the Mac App Store
        os.system('productbuild --component "Build/'+finalAppName+'.app/" /Applications --sign "3rd Party Mac Developer Installer: Philipp Mayr (59925VM83D)" --product "Build/'+finalAppName+'.app/Contents/Info.plist" "Build/'+finalAppName+'.pkg"')

        print("IMPORTANT NOTE: Please use the Application Loader app with version 3.0 since newer versioins will fail to upload the resulting pkg file.")
        print()

    def helper_renameMacApp(self, path, newName, theCFBundleIdentifier):
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


class WindowsBuilder32bit(Builder):
    def getYarnExecutablePath(self) -> str:
        return "C:\\Program Files (x86)\\Yarn\\bin\\yarn.cmd"

    def build(self, codeDir: str, destinationDir: str, *, appName: str):
        logging.info("Building for Windows 32 bit")
        buildDir = os.path.join(destinationDir, "win32")
        if os.path.exists(buildDir):
            shutil.rmtree(buildDir)

        # obfuscate javascript source code
        obfuscatedCodeDir = os.path.join(buildDir, "tmp", "ObfuscatedCode")
        if os.path.exists(obfuscatedCodeDir):
            shutil.rmtree(obfuscatedCodeDir)
            
        self.obfuscateJavaScriptDirectory(codeDir, obfuscatedCodeDir)
        codeDir = obfuscatedCodeDir

        # create app and copy source code
        logging.info("Creating App and copying resources")
        electronWindowsAppSource = os.path.join("electron-v3.1.6-win32-ia32")
        shutil.copytree(electronWindowsAppSource, os.path.join(buildDir, appName), symlinks=True)
        shutil.copytree(codeDir, os.path.join(buildDir, appName, "resources", "app"), symlinks=True)

        # Rename electron.exe to appName so a user can find the app better if the users stats it from within the dir and not a shortcut
        logging.info("Remame executable")
        electronDirInDist = os.path.join(buildDir, appName)
        shutil.move(os.path.join(electronDirInDist, "electron.exe"), os.path.join(electronDirInDist, appName+".exe"))

        # Change the default Electron icon to a App spesific one
        logging.info("Chanching default executable icon")
        subprocess.call([".\\rcedit-x86.exe", "./Build/win32/PM Markdown Editor/PM Markdown Editor.exe", "--set-icon", ".\\Artwork\\WindowsAppIcon.ico"])

        # Remvoe the old installer and create a new one
        logging.info("Creating installer")
        installerScriptPath = "windowsinstaller.nsi"
        InstallerExeFilePath = os.path.abspath(os.path.join(destinationDir, "PM Markdown Editor Installer.exe"))
        if os.path.exists(InstallerExeFilePath):
            os.remove(InstallerExeFilePath)
        subprocess.call(["C:\\Program Files (x86)\\NSIS\\makensis.exe", f"./{installerScriptPath}"])


class BuilderFactory():
    @classmethod
    def getBuilderNativeToCurrentPlatform(cls) -> Builder:
        if sys.platform == "darwin":
            return MacBuilder()
        elif sys.platform == "win32":
            return WindowsBuilder32bit()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    builder = BuilderFactory.getBuilderNativeToCurrentPlatform()
    builder.CFBundleIdentifier = "de.philippmayr.markdowneditor"  # required for the Mac version
    builder.build(
        codeDir="Code",
        destinationDir="Build",
        appName="PM Markdown Editor"
    )
