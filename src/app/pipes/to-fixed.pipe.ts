import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'toFixed'
})
export class ToFixedPipe implements PipeTransform {

	transform(value: number, fractionLimit?: number): unknown {

		if (isNaN(value) || value === undefined || value === null) {
			return null;
		}

		let _value = value.toString();

		let whole = '',
			fraction = '';

		if (_value.indexOf('.') > -1) {
			[whole, fraction] = _value.split('.')
		}
		else {
			whole = _value;
		}

		let usFormat = '';
		let count = 0;
		for (let c = whole.length - 1; c >= 0; c--) {
			if (count === 3) {
				usFormat = ',' + usFormat;
				count = 0;
			}
			usFormat = whole[c] + usFormat;
			count++;
		}

		let trimmedFraction = '';
		if (fractionLimit > 0) {
			trimmedFraction = '.' + fraction.slice(0, fractionLimit);
			trimmedFraction = trimmedFraction.padEnd(fractionLimit + 1, '0');
		}
		return usFormat + trimmedFraction;
	}

}
