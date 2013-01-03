function capitialize(string) {
    // Convert the given string to title-case
    return string.replace(/\w\S*/g, function(text) {
        // Capitialize the first letter of the string
        // Consider it a valid word if it starts with a character and 0 or more non-whitespace chars follow it
        return text.charAt(0).toUpperCase() + text.substring(1);
    });
}

var data = {}, last = "";
$("tr").each(function() {
    var $this = $(this), claus = $this.attr("class"), text = $this.text().trim();
    if (!claus) {
        data[text] = {};
        last = text;
    } else if (claus == "q") {
        var $tds = $this.children(), title = capitialize($($tds[0]).text().trim());
        data[last][title] = {
            "0" : $($tds.get(1)).text().trim(),
            "1" : $($tds.get(2)).text().trim(),
            "2" : $($tds.get(3)).text().trim(),
            "3" : $($tds.get(4)).text().trim()
        };
    }
});
console.log(data);
console.log(JSON.stringify(data));
