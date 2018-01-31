``` python
#! /usr/bin/env python

def getlang(text):
    # list form wikipedia
    english = ["the", "be", "to", "off", "and", "a", "in", "that", "have", "i", "if", "for", "not", "on", "with", "he", "as", "you", "do", "at"]
    german = ["der", "die", "und", "in", "den", "von", "zu", "das", "mit", "sich", "als", "auch", "es", "an", "werden", "aus", "er", "hat", "dass", "sie"]

    CountEnglish = 0
    CountGerman = 0

    text = text.split(' ')

    for iWord in range(len(text)):
        if text[iWord] in english:
            CountEnglish = +1
        elif text[iWord] in german:
            CountGerman = +1

    if CountEnglish > CountGerman:
        return "english"
    elif CountGerman > CountEnglish:
        return "german"
    else:
        return 1


if __name__ == "__main__":
    import sys
    import os

    text = sys.stdin.read()

    detectedlang = getlang(text)
    if sys.platform == "darwin":
        if detectedlang == 0:
            speakcomand = "say "+str(text)
        elif detectedlang == "english":
            speakcomand = "say -v Samantha "+str(text)
        elif detectedlang == "german":
                speakcomand = "say -v Anna "+str(text)

```