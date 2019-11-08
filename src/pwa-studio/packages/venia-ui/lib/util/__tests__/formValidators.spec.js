import * as validators from '../formValidators';

describe('hasLengthAtLeast', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthAtLeast('test', [], 1);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthAtLeast('test', [], 10);

        expect(typeof result).toBe('string');
    });
});

describe('hasLengthAtMost', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthAtMost('test', [], 10);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthAtMost('test', [], 1);

        expect(typeof result).toBe('string');
    });
});

describe('hasLengthExactly', () => {
    test('it returns undefined on success', () => {
        const result = validators.hasLengthExactly('test', [], 4);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.hasLengthExactly('test', [], 1);

        expect(typeof result).toBe('string');
    });
});

describe('isRequired', () => {
    test('it returns undefined on success', () => {
        const result = validators.isRequired('test');

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.isRequired('');

        expect(typeof result).toBe('string');
    });

    test('it returns a string on failure', () => {
        const result = validators.isRequired(' ');

        expect(typeof result).toBe('string');
    });
});

describe('validateEmail', () => {
    test('it returns undefined on success', () => {
        const result = validators.validateEmail('johndoe@domain.com');

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const result = validators.validateEmail('johndoe@domain');

        expect(typeof result).toBe('string');
    });
});

describe('validateRegionCode', () => {
    const countries = [
        {
            id: 'US',
            available_regions: [
                {
                    id: '1',
                    code: 'AL',
                    name: 'Alabama'
                }
            ]
        },
        { id: 'UA' },
        { id: 'UK' }
    ];

    test('it returns undefined on success', () => {
        const result = validators.validateRegionCode('AL', [], countries);

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure due to bad state value', () => {
        const result = validators.validateRegionCode(
            'some_string',
            [],
            countries
        );

        expect(typeof result).toBe('string');
    });

    test('it returns a string on failure due to missing country', () => {
        const result = validators.validateRegionCode('AL', [], []);

        expect(typeof result).toBe('string');
    });

    test('it returns a string on failure due to no regions', () => {
        const missingRegions = [...countries];
        missingRegions[0].available_regions = [];

        const result = validators.validateRegionCode(
            'some_string',
            [],
            missingRegions
        );

        expect(typeof result).toBe('string');
    });
});

describe('validatePassword', () => {
    test('it returns undefined on success', () => {
        const result = validators.validatePassword('123qwe_+*');

        expect(result).toBeUndefined();
    });

    test('it returns a string on  failure', () => {
        const result = validators.validatePassword('1111');

        expect(typeof result).toBe('string');
    });
});

describe('validateConfirmPassword', () => {
    test('it returns undefined on success', () => {
        const values = {
            password: 'qwerty12345'
        };
        const password = 'qwerty12345';
        const result = validators.validateConfirmPassword(password, values);

        expect(result).toBeUndefined();
    });

    test('it returns undefined on success with a password key', () => {
        const values = {
            password_key: 'qwerty12345'
        };
        const password = 'qwerty12345';
        const passwordKey = 'password_key';
        const result = validators.validateConfirmPassword(
            password,
            values,
            passwordKey
        );

        expect(result).toBeUndefined();
    });

    test('it returns a string on failure', () => {
        const values = {
            password: 'qwertz12345'
        };
        const password = 'qwerty12345';
        const result = validators.validateConfirmPassword(password, values);

        expect(typeof result).toBe('string');
    });
});
