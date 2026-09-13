```javascript
function applyEnglish() {

    const replacements = {
        "ভাষা": "Language",
        "ভাষা নির্বাচন করুন": "Select Language",
        "চেহারা": "Appearance",
        "থিম নির্বাচন করুন": "Choose Theme",
        "বিজ্ঞপ্তি": "Notifications",
        "সেটিংস": "Settings",
        "অ্যাকাউন্ট": "Account",
        "নিরাপত্তা": "Security",
        "স্টোরেজ": "Storage",
        "ব্যাকআপ": "Backup",
        "রিস্টোর": "Restore",

        "ফাইলের নাম লিখুন...": "Enter file name...",
        "কোনো file পাওয়া যায়নি।": "No file found.",
        "কোনো Recent file পাওয়া যায়নি।": "No recent files found.",

        "আগে একটি file নির্বাচন করুন।":
            "Please select a file first.",

        "আগে একটি photo নির্বাচন করুন।":
            "Please select a photo first."
    };

    function replaceText(node) {

        if (node.nodeType === Node.TEXT_NODE) {

            let text = node.nodeValue;

            for (let bangla in replacements) {

                text = text.split(bangla).join(
                    replacements[bangla]
                );
            }

            node.nodeValue = text;
        }

        else {

            for (let child of node.childNodes) {
                replaceText(child);
            }
        }
    }

    if (document.body) {
        replaceText(document.body);
    }

    const inputs = document.querySelectorAll(
        "input[placeholder]"
    );

    inputs.forEach(function (input) {

        for (let bangla in replacements) {

            if (input.placeholder.includes(bangla)) {

                input.placeholder =
                    input.placeholder.split(bangla).join(
                        replacements[bangla]
                    );
            }
        }
    });
}
```
