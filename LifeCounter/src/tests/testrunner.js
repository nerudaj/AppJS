function TestHelperLongestStr(strings, expected) {
    var result = longestStr(strings);

    if (expected != result) {
        console.log("TestHelperLongestStr: " + result + " mismatches " + expected);
    }
    else {
        console.log("TestHelperLongestStr: OK");
    }
}