var lang = require("./lang.js");

function supportLanguages() {
    return lang.supportLanguages.map(([standardLang]) => standardLang);
}


function translate(query, completion) {

    var targetTxtArr = []

	let cleanText = query.text.replace(/[\,\s]/g, ''); //compatible  1,647,105,421 

	let regex = /\d{10,13}/g;

	let timestamps = cleanText.match(regex);

    if (timestamps == undefined) {
        completion({
            error: {
                type: "api",
                message: "there is no timestamp in the selected statement",
            },
        });
    }

	if (timestamps.length != 0) {
		for (let i = 0; i < timestamps.length; i++) {
			if (timestamps[i] > 32503680000) {
				continue
			}
			targetTxtArr.push(`${timestamps[i]} => ${formatDate(timestamps[i]* 1000,$option.date_format)}`)
		}
	}

    completion({
        result: {
            from: query.detectFrom,
            to: query.detectTo,
            toParagraphs: targetTxtArr,
        },
    });
    
}


function formatDate(value = Date.now(), format = "Y-M-D h:m:s") {
    const formatNumber = n => `0${n}`.slice(-2);
    const date = new Date(value);
    const formatList = ["Y", "M", "D", "h", "m", "s"];
    const resultList = [];
    resultList.push(date.getFullYear().toString());
    resultList.push(formatNumber(date.getMonth() + 1));
    resultList.push(formatNumber(date.getDate()));
    resultList.push(formatNumber(date.getHours()));
    resultList.push(formatNumber(date.getMinutes()));
    resultList.push(formatNumber(date.getSeconds()));
    for (let i = 0; i < resultList.length; i++) {
        format = format.replace(formatList[i], resultList[i]);
    }
    return format;
}

exports.supportLanguages = supportLanguages;
exports.translate = translate;
