var path = require('path');
var hinter = require('../../../../');

var rule = path.basename(__dirname);

describe('rule ' + rule, function () {
    var result = hinter.hintFile(path.join(__dirname, 'case.html'));

    it('should return right result', function () {
        expect(result.length).toBe(4);

        expect(result[0].type).toBe('WARN');
        expect(result[0].rule).toBe('026');
        expect(result[0].line).toBe(11);
        expect(result[0].col).toBe(5);

        expect(result[1].type).toBe('WARN');
        expect(result[1].rule).toBe('026');
        expect(result[1].line).toBe(12);
        expect(result[1].col).toBe(5);

        expect(result[2].type).toBe('WARN');
        expect(result[2].rule).toBe('026');
        expect(result[2].line).toBe(13);
        expect(result[2].col).toBe(5);

        expect(result[3].type).toBe('WARN');
        expect(result[3].rule).toBe('026');
        expect(result[3].line).toBe(14);
        expect(result[3].col).toBe(5);
    });
});
