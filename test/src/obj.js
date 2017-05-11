'use strict';


const is = require('../../index').is;
const obj = require('../../index').obj;
const assert = require('chai').assert;


suite('obj module', function() {
	
	suite('obj.copy', function() {
		test('empty object', () => {
			assert.deepEqual({}, obj.copy({}));
		});
		
		test('same data returned', () => {
			var subject = {a: 1, b: 2};
			var res = obj.copy(subject);
			
			assert.deepEqual(res, subject);
		});
		
		test('new object returned', () => {
			var subject = {a: 1, b: 2};
			var res = obj.copy(subject);
			
			assert.isFalse(res === subject);
		});
	});
	
	suite('obj.mix', function() {
		test('empty object', () => {
			assert.deepEqual({}, obj.mix({}));
		});
		
		test('empty mixed objects', () => {
			assert.deepEqual({ a: 1 }, obj.mix({ a: 1 }, {}, {}));
		});
		
		test('objects mixed in', () => {
			assert.deepEqual({ a: 1, b: 2, c: 3 }, obj.mix({ a: 1 }, { b: 2 }, { c: 3 }));
		});
		
		test('newer objects override', () => {
			assert.deepEqual({ a: 3 }, obj.mix({ a: 1 }, { a: 2 }, { a: 3 }));
		});
		
		test('original object is modified', () => {
			var subject = { a: 1 };
			obj.mix(subject, { b: 2 });
			assert.deepEqual({ a: 1, b: 2 }, subject);
		});
		
		test('original object is returned', () => {
			var subject = { a: 1 };
			assert.isTrue(subject === obj.mix(subject, { b: 2 }));
		});
		
		test('other objects are not modified', () => {
			var subject = { a: 1 };
			var b = { b: 2 };
			var c = { c: 3 };
			
			obj.mix(subject, b, c);
			
			assert.deepEqual({ b: 2 }, b);
			assert.deepEqual({ c: 3 }, c);
		});
	});
	
	suite('obj.merge', function() {
		test('no data passed', () => {
			assert.deepEqual({}, obj.merge());
		});
		
		test('empty object', () => {
			assert.deepEqual({}, obj.merge({}));
		});
		
		test('empty objects merge', () => {
			assert.deepEqual({}, obj.merge({}, {}, {}));
		});
		
		test('objects merge', () => {
			assert.deepEqual({ a: 1, b: 2, c: 3 }, obj.merge({ a: 1 }, { b: 2 }, { c: 3 }));
		});
		
		test('newer values override', () => {
			assert.deepEqual({ a: 3 }, obj.merge({ a: 1 }, { a: 2 }, { a: 3 }));
		});
		
		test('other objects are not modified', () => {
			var a = { a: 1 };
			var b = { b: 2 };
			var c = { c: 3 };
			
			obj.merge(a, b, c);
			
			assert.deepEqual({ a: 1 }, a);
			assert.deepEqual({ b: 2 }, b);
			assert.deepEqual({ c: 3 }, c);
		});
	});
	
	suite('obj.values', function() {
		test('empty object return array', function() {
			assert.isArray(obj.values({}));
		});
		
		test('empty object return empty array', function() {
			assert.equal(0, obj.values({}).length);
		});
		
		test('not empty object return values', function() {
			assert.deepEqual([1, 'b'], obj.values({a: 1, b: 'b'}));
		});
		
		test('object with prototype values does not return prototype values', function() {
			var foo = function() {};
			foo.prototype.c = 1;
			
			var a = new foo;
			a.b = 2;
			
			assert.deepEqual([2], obj.values(a));
		});
	});
	
	
	suite('obj.keys', () => {
		test('empty object return array', () => {
			assert.isArray(obj.keys({}));
		});
		
		test('empty object empty keys', () => {
			assert.deepEqual([], obj.keys({}));
		});
		
		test('object with keys will return keys', () => {
			assert.deepEqual(['a', '2'].sort(), obj.keys({'a': 'b', 2: 3}).sort());
		});
		
		test('key with undefined value', () => {
			assert.deepEqual(['k'], obj.keys({'k': undefined}));
		});
		
		test('object with prototype values does not return prototype values', function() {
			var foo = function() {};
			foo.prototype.c = 1;
			
			var a = new foo;
			a.b = 2;
			
			assert.deepEqual(['b'], obj.keys(a));
		});
	});
	
	
	suite('obj.count', () => {
		test('empty object return 0', () => {
			assert.equal(0, obj.count({}));
		});
		
		test('object with keys will returns count', () => {
			assert.equal(2, obj.count({'a': 'b', 2: 3}));
		});
		
		test('undefined value counted', () => {
			assert.deepEqual(1, obj.count({'k': undefined}));
		});
		
		test('prototype keys are not counted', function() {
			var foo = function() {};
			foo.prototype.c = 1;
			
			var a = new foo;
			assert.equal(0, obj.count(a));
			
			a.b = 2;
			assert.equal(1, obj.count(a));
		});
	});
	
	
	suite('obj.any', () => {
		test('obj.any equals obj.any.value', () => {
			assert.equal(obj.any, obj.any.value);
		});
		
		
		suite('obj.any.value', () => {
			test('empty object return undefined', () => {
				assert.isUndefined(obj.any.value({}));
			});
			
			test('object with one key return a value', () => {
				assert.equal(1, obj.any.value({'a': 1}));
			});
			
			test('object with keys return a value', () => {
				assert.include(['a', 2], obj.any.value({'c': 2, 'b': 'a'}));
			});
			
			test('object with undefined value returns undefined', () => {
				assert.equal(undefined, obj.any.value({'c': undefined}));
			});
		});
		
		suite('obj.any.key', () => {
			test('empty object return undefined', () => {
				assert.isUndefined(obj.any.key({}));
			});
			
			test('object with one key return a key', () => {
				assert.equal('a', obj.any.key({'a': 1}));
			});
			
			test('object with keys return a key', () => {
				assert.include(['a', 'b'], obj.any.key({'a': 2, 'b': 'c'}));
			});
			
			test('object with undefined value returns key', () => {
				assert.equal('c', obj.any.key({'c': undefined}));
			});
		});
		
		suite('obj.any.item', () => {
			test('empty object return undefined', () => {
				assert.isUndefined(obj.any.item({}));
			});
			
			test('object with element, element returned', () => {
				assert.deepEqual({'a': 1}, obj.any.item({'a': 1}));
			});
			
			test('object with number of items', () => {
				assert.include([{'a': 2}, {'b': 'c'}], obj.any.item({'a': 2, 'b': 'c'}));
			});
			
			test('object with undefined value returns item', () => {
				assert.deepEqual({'c': undefined}, obj.any.item({'c': undefined}));
			});
		});
	});
	
	suite('obj.forEach', () => {
		test('forEach equals to forEach.values', () => {
			assert.equal(obj.forEach, obj.forEach.value);
		});
		
		
		suite('obj.forEach.value', () => {
			test('empty object', () => {
				let result = [];
				obj.forEach.value({}, (...args) => { result.push(args) });
				assert.deepEqual([], result);
			});
			
			test('object with undefined value', () => {
				let result = [];
				obj.forEach.value({k: undefined}, (...args) => { result.push(args) });
				assert.deepEqual([[undefined]], result);
			});
			
			test('object with values', () => {
				let result = [];
				obj.forEach.value({'a': 'b', 'c': {'a': 12}}, (...args) => { result.push(args) });
				assert.deepEqual([['b'], [{'a': 12}]], result);
			});
			
			test('break aborts loop', () => {
				let result = [];
				obj.forEach.value({'a': 'b', 'c': 'd'}, (...args) => { result.push(args); return false });
				assert.deepEqual([['b']], result);
			});
			
			test('object with inherited', () => {
				let result = [];
				let testClass = function() {};
				testClass.prototype.a = 12;
				
				obj.forEach.value(new testClass, (...args) => { result.push(args) });
				assert.deepEqual([], result);
			});
		});
		
		suite('obj.forEach.key', () => {
			test('empty object', () => {
				let result = [];
				obj.forEach.key({}, (...args) => { result.push(args) });
				assert.deepEqual([], result);
			});
			
			test('object with undefined value', () => {
				let result = [];
				obj.forEach.key({k: undefined}, (...args) => { result.push(args) });
				assert.deepEqual([['k']], result);
			});
			
			test('object with key', () => {
				let result = [];
				obj.forEach.key({'a': 'b', 'c': {'a': 12}}, (...args) => { result.push(args) });
				assert.deepEqual([['a'], ['c']], result);
			});
			
			test('break aborts loop', () => {
				let result = [];
				obj.forEach.key({'a': 'b', 'c': 'd'}, (...args) => { result.push(args); return false });
				assert.deepEqual([['a']], result);
			});
			
			test('object with inherited', () => {
				let result = [];
				let testClass = function() {};
				testClass.prototype.a = 12;
				
				obj.forEach.key(new testClass, (...args) => { result.push(args) });
				assert.deepEqual([], result);
			});
		});
		
		suite('obj.forEach.pair', () => {
			test('empty object', () => {
				let result = [];
				obj.forEach.pair({}, (...args) => { result.push(args) });
				assert.deepEqual([], result);
			});
			
			test('object with key', () => {
				let result = [];
				obj.forEach.pair({'a': 'b', 'c': {'a': 12}}, (...args) => { result.push(args) });
				assert.deepEqual([['a', 'b'], ['c', {'a': 12}]], result);
			});
			
			test('break aborts loop', () => {
				let result = [];
				obj.forEach.pair({'a': 'b', 'c': 'd'}, (...args) => { result.push(args); return false });
				assert.deepEqual([['a', 'b']], result);
			});
			
			test('object with undefined value', () => {
				let result = [];
				obj.forEach.pair({k: undefined}, (...args) => { result.push(args) });
				assert.deepEqual([['k', undefined]], result);
			});
			
			test('object with inherited', () => {
				let result = [];
				let testClass = function() {};
				testClass.prototype.a = 12;
				
				obj.forEach.pair(new testClass, (...args) => { result.push(args) });
				assert.deepEqual([], result);
			});
		});
		
		suite('obj.forEach.item', () => {
			test('empty object', () => {
				let result = [];
				obj.forEach.item({}, (...args) => { result.push(args) });
				assert.deepEqual([], result);
			});
			
			test('object with key', () => {
				let result = [];
				obj.forEach.item({'a': 'b', 'c': {'a': 12}}, (...args) => { result.push(args) });
				assert.deepEqual([[{'a': 'b'}], [{'c': {'a': 12}}]], result);
			});
			
			test('object with undefined value', () => {
				let result = [];
				obj.forEach.item({k: undefined}, (...args) => { result.push(args) });
				assert.deepEqual([[{'k': undefined}]], result);
			});
			
			test('break aborts loop', () => {
				let result = [];
				obj.forEach.item({'a': 'b', 'c': 'd'}, (...args) => { result.push(args); return false });
				assert.deepEqual([[{'a': 'b'}]], result);
			});
			
			test('object with inherited', () => {
				let result = [];
				let testClass = function() {};
				testClass.prototype.a = 12;
				
				obj.forEach.item(new testClass, (...args) => { result.push(args) });
				assert.deepEqual([], result);
			});
		});
	});
	
	suite('obj.filter', function() {
		test('obj.filter.value same as obj.filter', () => {
			assert.strictEqual(obj.filter, obj.filter.value);
		});
		
		
		suite('obj.filter.value', () => {
			test('value passed to callback', () => {
				let result = [];
				obj.filter.value({'a': 'b', 'c': 'd'}, (...args) => { result.push(args); });
				assert.deepEqual([['b'], ['d']], result);
			});
			
			test('only filtered items returned', () => {
				var res = obj.filter.value({'a': 1, 'c': 2, 'e': 3, 'f': 4}, (num) => { return num % 2 === 0; });
				assert.deepEqual({'c': 2, 'f': 4}, res);
			});
			
			test('returned null will abort', () => {
				var res = obj.filter.value(
					{'a': 1, 'c': 2, 'e': 3, 'f': 4}, 
					(num) => { 
						if (num === 3) return null;
						
						return num % 2 === 0; 
					}
				);
				
				assert.deepEqual({'c': 2}, res);
			});
		});
		
		suite('obj.filter.key', () => {
			test('key passed to callback', () => {
				let result = [];
				obj.filter.key({'a': 'b', 'c': 'd'}, (...args) => { result.push(args); });
				assert.deepEqual([['a'], ['c']], result);
			});
			
			test('only filtered items returned', () => {
				var res = obj.filter.key(
					{'a': 1, 'c': 2, 'e': 3, 'f': 4}, 
					(num) => { return num === 'c' || num === 'f'; }
				);
				
				assert.deepEqual({'c': 2, 'f': 4}, res);
			});
			
			test('returned null will abort', () => {
				var res = obj.filter.key(
					{'a': 1, 'c': 2, 'e': 3, 'f': 4}, 
					(k) => { 
						if (k === 'e') return null;
						
						return k === 'c' || k === 'f';
					}
				);
				
				assert.deepEqual({'c': 2}, res);
			});
		});
		
		suite('obj.filter.pair', () => {
			test('obj.filter.pair pair passed to callback', () => {
				let result = [];
				obj.filter.pair({'a': 'b', 'c': 'd'}, (...args) => { result.push(args); });
				assert.deepEqual([['a', 'b'], ['c', 'd']], result);
			});
			
			test('only filtered items returned', () => {
				var res = obj.filter.pair({'a': 1, 'c': 2, 'e': 3, 'f': 4}, (k, num) => { return num % 2 === 0; });
				assert.deepEqual({'c': 2, 'f': 4}, res);
			});
			
			test('returned null will abort', () => {
				var res = obj.filter.pair(
					{'a': 1, 'c': 2, 'e': 3, 'f': 4}, 
					(k, num) => { 
						if (num === 3) return null;
						
						return num % 2 === 0; 
					}
				);
				
				assert.deepEqual({'c': 2}, res);
			});
		});
		
		suite('obj.filter.item', () => {
			test('item passed to callback', () => {
				let result = [];
				obj.filter.item({'a': 'b', 'c': 'd'}, (...args) => { result.push(args); });
				assert.deepEqual([[{'a': 'b'}], [{'c': 'd'}]], result);
			});
			
			test('only filtered items returned', () => {
				var res = obj.filter.item(
					{'a': 1, 'c': 2, 'e': 3, 'f': 4}, 
					(data) => { return is(data['c']) || is(data['f']); }
				);
				
				assert.deepEqual({'c': 2, 'f': 4}, res);
			});
			
			test('returned null will abort', () => {
				var res = obj.filter.item(
					{'a': 1, 'c': 2, 'e': 3, 'f': 4}, 
					(data) => { 
						if (is(data['e'])) return null;
						
						return is(data['c']) || is(data['f']);
					}
				);
				
				assert.deepEqual({'c': 2}, res);
			});
		});
	});
});