;--------------------------------
;Include Modern UI

!include "MUI2.nsh"
!include "FileAssociation.nsh"

;--------------------------------
;General

;Properly display all languages (Installer will not work on Windows 95, 98 or ME!)
Unicode true

; Insatller branding
BrandingText "Avalonsfot, Installer System 1.0"

;Name and file
!define COMPANY_NAME "Avalonsoft"
!define APP_NAME "PM Markdown Editor"

# This will be in the installer/uninstaller's title bar
Name "${APP_NAME}"
;Icon "logo.ico"
OutFile "Build/${APP_NAME} Installer.exe"

;Default installation folder
; Using local app data here because we dont need admin privileges for that
; and also no complicated logic asking the user for multi user or simgle user install
InstallDir "$LOCALAPPDATA\${COMPANY_NAME}\${APP_NAME}"

;Get installation folder from registry if available
InstallDirRegKey HKCU "Software\${APP_NAME}" "" ; good for updates?

;Request application privileges for Windows Vista
RequestExecutionLevel user

;--------------------------------
;Interface Settings

!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "PM Markdown Editor.exe"
!define MUI_ICON "Artwork/WindowsAppIcon.ico"


;--------------------------------
;Pages

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENCEWINDOWSINSTALL_EN.txt"
;!insertmacro MUI_PAGE_COMPONENTS ; the App is simple without any components
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

;--------------------------------
;Languages
 
;--------------------------------
;Languages

  !insertmacro MUI_LANGUAGE "English" ; The first language is the default language
  !insertmacro MUI_LANGUAGE "French"
  !insertmacro MUI_LANGUAGE "German"
  !insertmacro MUI_LANGUAGE "Spanish"
  !insertmacro MUI_LANGUAGE "SpanishInternational"
  !insertmacro MUI_LANGUAGE "SimpChinese"
  !insertmacro MUI_LANGUAGE "TradChinese"
  !insertmacro MUI_LANGUAGE "Japanese"
  !insertmacro MUI_LANGUAGE "Korean"
  !insertmacro MUI_LANGUAGE "Italian"
  !insertmacro MUI_LANGUAGE "Dutch"
  !insertmacro MUI_LANGUAGE "Danish"
  !insertmacro MUI_LANGUAGE "Swedish"
  !insertmacro MUI_LANGUAGE "Norwegian"
  !insertmacro MUI_LANGUAGE "NorwegianNynorsk"
  !insertmacro MUI_LANGUAGE "Finnish"
  !insertmacro MUI_LANGUAGE "Greek"
  !insertmacro MUI_LANGUAGE "Russian"
  !insertmacro MUI_LANGUAGE "Portuguese"
  !insertmacro MUI_LANGUAGE "PortugueseBR"
  !insertmacro MUI_LANGUAGE "Polish"
  !insertmacro MUI_LANGUAGE "Ukrainian"
  !insertmacro MUI_LANGUAGE "Czech"
  !insertmacro MUI_LANGUAGE "Slovak"
  !insertmacro MUI_LANGUAGE "Croatian"
  !insertmacro MUI_LANGUAGE "Bulgarian"
  !insertmacro MUI_LANGUAGE "Hungarian"
  !insertmacro MUI_LANGUAGE "Thai"
  !insertmacro MUI_LANGUAGE "Romanian"
  !insertmacro MUI_LANGUAGE "Latvian"
  !insertmacro MUI_LANGUAGE "Macedonian"
  !insertmacro MUI_LANGUAGE "Estonian"
  !insertmacro MUI_LANGUAGE "Turkish"
  !insertmacro MUI_LANGUAGE "Lithuanian"
  !insertmacro MUI_LANGUAGE "Slovenian"
  !insertmacro MUI_LANGUAGE "Serbian"
  !insertmacro MUI_LANGUAGE "SerbianLatin"
  !insertmacro MUI_LANGUAGE "Arabic"
  !insertmacro MUI_LANGUAGE "Farsi"
  !insertmacro MUI_LANGUAGE "Hebrew"
  !insertmacro MUI_LANGUAGE "Indonesian"
  !insertmacro MUI_LANGUAGE "Mongolian"
  !insertmacro MUI_LANGUAGE "Luxembourgish"
  !insertmacro MUI_LANGUAGE "Albanian"
  !insertmacro MUI_LANGUAGE "Breton"
  !insertmacro MUI_LANGUAGE "Belarusian"
  !insertmacro MUI_LANGUAGE "Icelandic"
  !insertmacro MUI_LANGUAGE "Malay"
  !insertmacro MUI_LANGUAGE "Bosnian"
  !insertmacro MUI_LANGUAGE "Kurdish"
  !insertmacro MUI_LANGUAGE "Irish"
  !insertmacro MUI_LANGUAGE "Uzbek"
  !insertmacro MUI_LANGUAGE "Galician"
  !insertmacro MUI_LANGUAGE "Afrikaans"
  !insertmacro MUI_LANGUAGE "Catalan"
  !insertmacro MUI_LANGUAGE "Esperanto"
  !insertmacro MUI_LANGUAGE "Asturian"
  !insertmacro MUI_LANGUAGE "Basque"
  !insertmacro MUI_LANGUAGE "Pashto"
  !insertmacro MUI_LANGUAGE "ScotsGaelic"
  !insertmacro MUI_LANGUAGE "Georgian"
  !insertmacro MUI_LANGUAGE "Vietnamese"
  !insertmacro MUI_LANGUAGE "Welsh"
  !insertmacro MUI_LANGUAGE "Armenian"
  !insertmacro MUI_LANGUAGE "Corsican"
  !insertmacro MUI_LANGUAGE "Tatar"
  !insertmacro MUI_LANGUAGE "Hindi"

;--------------------------------
;Installer Sections

Section "Install" SecDummy

SetOutPath "$INSTDIR"

;ADD YOUR OWN FILES HERE...
File /nonfatal /r "Build/win32/${APP_NAME}\" ; keep backslash at the end to copy a directory

; add the licence client
File /nonfatal "LicenceClientConfig.json"
SetOutPath "$INSTDIR\LicenceClient"
File /nonfatal /r "LicenceClient 1.1.0 Windows x32\LicenceClient\" ; keep backslash at the end to copy a directory

;Store installation folder
WriteRegStr HKCU "Software\${APP_NAME}" "" $INSTDIR ; good for updates?

${registerExtension} "$INSTDIR\${APP_NAME}.exe" ".md" "Markdown_File"
${registerExtension} "$INSTDIR\${APP_NAME}.exe" ".markdown" "Markdown_File"
${registerExtension} "$INSTDIR\${APP_NAME}.exe" ".mkdn" "Markdown_File"
${registerExtension} "$INSTDIR\${APP_NAME}.exe" ".mkd" "Markdown_File"
${registerExtension} "$INSTDIR\${APP_NAME}.exe" ".mdwn" "Markdown_File"
; used only to check wheter the file extention is registering itself correctly
${registerExtension} "$INSTDIR\${APP_NAME}.exe" ".pmmd" "Markdown_File"


;Create uninstaller
WriteUninstaller "$INSTDIR\Uninstall.exe"

SectionEnd


Section "Shortcuts"
; desktop link
CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe"

; start menu link
CreateDirectory "$SMPrograms\${COMPANY_NAME}"
CreateShortCut "$SMPROGRAMS\${COMPANY_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_NAME}.exe"
SectionEnd



; The uninstall section

Section "Uninstall"

Delete "$INSTDIR\Uninstall.exe"

; remvoe main program
RMDir /r /REBOOTOK $INSTDIR

; remove desktop icon
Delete "$DESKTOP\${APP_NAME}.lnk"

; remove start menu items
Delete "$SMPROGRAMS\${COMPANY_NAME}\${APP_NAME}.lnk"

; remove the ${COMPANY_NAME} folder if it is empty (and not contianing any other software from the company)
RMDir /REBOOTOK "$SMPrograms\${COMPANY_NAME}"

; remove file extention assosiations
${unregisterExtension} ".md" "Markdown_File"
${unregisterExtension} ".markdown" "Markdown_File"
${unregisterExtension} ".mkdn" "Markdown_File"
${unregisterExtension} ".mkd" "Markdown_File"
${unregisterExtension} ".mdwn" "Markdown_File"
${unregisterExtension} ".pmmd" "Markdown_File"

; remove regkeys
DeleteRegKey /ifempty HKCU "Software\${APP_NAME}"

; open url in browser to ask the user why the software was uninstalled
; the intention is to help improve the software based on this type of user feedback
ExecShell "open" "https://avalonsoft.de/"

SectionEnd
