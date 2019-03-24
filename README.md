# Markdown Editor

New marketing idea: This app will be aviable in two versions on the Mac App Store. One lite version that can be upgraded with In-App Purchases and one Full version with all In-App purchases already integrated. This way we might be able to cover a broader customer range as well as see which features are used/paid/valued most.

### Relevant for first version (MVP)

* [x] Integrale Open Source Editor from Github
* [x] Warp in Mac UI
* [x] Splitscreen
* [x] Fullscreen
* [x] Save Open file in UI (multiple Files? / Project)
* [x] Register .md filetype
* [x] Drag file / folder on app icon and open
* [x] In AppMenu -> View -> Close Window: Ask if file should be saved
* [x] In AppMenu -> Save not working if file path not yet known
* [x] Fix AppMenu -> file -> Save (only save as is currently working)
* [x] Change Version to 1.0.0
* [ ] Links in WYSIWYG are fucking up the UI (trying to load a website and failing leafing the window white)
* [ ] Put together a License file with all the licenses of the projects being used
* [x] Update app and file icon
* [x] Create iTunes Connect entry

### In-App Purchase and in Full Version

* [ ] Export to PDF, HTML, ePub, DOCX
* [ ] Github gist integration
* [ ] Wordpress publish
* [ ] Vs code like command plate

### Second version

* [ ] Chart code block
* [ ] UML code block
* [ ] Remove keys patched by the md editor so the appmenu keys work
* [ ] Cheatsheet (link to website?)
* [ ] Inclusive tabs / Sidebar?
* [ ] Theme
* [ ] Words counter
* [ ] Launch from terminal (x-callback-url and little shell tool installable form website)
* [ ] Spell checking / dictionary lookup

### Backlog

* [ ] iCloud integration (other clouds like Dropbox, google, microsoft)
* [ ] Automation?
* [ ] Additional Web app?
* [ ] Versioning with Git (might be a very nice feature)
* [ ] Colaboration
* [ ] Space to tabs / tabs to space
* [ ] Search / regex search
* [ ] tab completion
* [ ] Voiceover?
* [ ] Autosave
* [ ] Emoji integration (either via image base64 code embedded or Macs/iOS own emoji chararacters)
* [ ] Markdown editor (personreferenz und tickets auf eigene dynamische links setzen per UI) ([https://www.webpagefx.com/tools/emoji-cheat-sheet/](https://www.webpagefx.com/tools/emoji-cheat-sheet/))
* [ ] Linter
* [ ] Detect change to file by other editor
* [ ] Validate all your links before publishing with the click of a button
* [ ] Multi cursors
* [ ] Code block linenumbers toggle

### Lookup features

Advanced analysis including word count, reading time, Fog Index and Flesch-Kincaid scores
Highlight word repetition and density
[https://www.sitepoint.com/the-best-markdown-editors-for-mac/](https://www.sitepoint.com/the-best-markdown-editors-for-mac/)
[https://github.com/benweet/stackedit](https://github.com/benweet/stackedit)
[https://github.com/sofish/pen](https://github.com/sofish/pen)
[https://github.com/lepture/editor](https://github.com/lepture/editor)
[https://github.com/jbt/markdown-editor](https://github.com/jbt/markdown-editor)
[https://github.com/alanshaw/markdown-pdf](https://github.com/alanshaw/markdown-pdf)
[https://github.com/mundimark/awesome-markdown](https://github.com/mundimark/awesome-markdown)
[https://github.com/markdown-it/markdown-it](https://github.com/markdown-it/markdown-it)
Great feature set for later ads:
[http://marked2app.com](http://marked2app.com)
[https://caret.io](https://caret.io)


# Building

## On Mac
TODO

## On Windows (32 bit)

* The tool yarn is required
* The npm tool is required
* The tool NSIS is required
* In the project root directory type ```yarn``` to install the development dependencies (currently the js obfuscator)
* Then just run make.py it will detect the OS and build for it automaticaly
* Take the installer that was created from the Build directory
