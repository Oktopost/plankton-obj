namespace('Plankton', function (root)
{
	'use strict';
	
	
	var is = root.Plankton.is;
	
	
	/**
	 * @name Plankton.obj
	 */
	var obj = {};
	
	
	/**
	 * @param {Object} subject
	 * @return {Object}
	 */
	obj.copy = function (subject)
	{
		var res = {};
		obj.forEach.pair(subject, function (key, val) { res[key] = val; });
		return res;
	};
	
	/**
	 * @param {Object} subject
	 * @return {Object}
	 */
	obj.mix = function (subject)
	{
		for (var i = 1; i < arguments.length; i++)
		{
			obj.forEach.pair(arguments[i], function (key, val) { subject[key] = val; });
		}
		
		return subject;
	};
	
	/**
	 * @return {Object}
	 */
	obj.merge = function ()
	{
		var res = {};
		
		for (var i = 0; i < arguments.length; i++)
		{
			obj.forEach.pair(arguments[i], function (key, val) { res[key] = val; });
		}
		
		return res;
	};
	
	/**
	 * @param {string|number} key
	 * @param {*} value
	 * @returns {Object}
	 */
	obj.combine = function (key, value)
	{
		var res = {};
		res[key] = value;
		return res;
	};
	
	/**
	 * @param subject
	 * @returns {*|undefined}
	 */
	obj.any = function (subject)
	{
		var key = obj.any.key(subject);
		return (is.defined(key) ? subject[key] : undefined);
	};
	
	/**
	 * @param {Object} subject
	 * @return {*|undefined}
	 */
	obj.any.value = obj.any;
	
	/**
	 * @param {Object} subject
	 * @return {*|undefined}
	 */
	obj.any.key = function (subject)
	{
		var keys = obj.keys(subject);
		return keys.length > 0 ? keys[0] : undefined;
	};
	
	/**
	 * @param {Object} subject
	 * @return {*|undefined}
	 */
	obj.any.item = function (subject)
	{
		var key = obj.any.key(subject);
		var res = undefined;
		
		if (is.defined(key))
		{
			res = obj.combine(key, subject[key]);
		}
		
		return res;
	};
	
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 * @param {*=} scope
	 */
	obj.forEach = function (subject, callback, scope)
	{
		obj.forEach.key(subject, function (key) 
		{
			return callback.call(scope, subject[key]);
		});
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 */
	obj.forEach.value = obj.forEach;
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 * @param {*=} scope
	 */
	obj.forEach.key = function (subject, callback, scope)
	{
		for (var key in subject)
		{
			if (!subject.hasOwnProperty(key))
			{
				continue;
			}
			
			if (callback.call(scope, key) === false)
			{
				break;
			}
		}
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 * @param {*=} scope
	 */
	obj.forEach.pair = function (subject, callback, scope)
	{
		obj.forEach.key(subject, function (key)
		{
			return callback.call(scope, key, subject[key]);
		});
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 * @param {*=} scope
	 */
	obj.forEach.item = function (subject, callback, scope)
	{
		obj.forEach.pair(subject, function (key, value)
		{
			return callback.call(scope, obj.combine(key, value));
		});
	};
	
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter = function (subject, callback, scope)
	{
		return obj.filter.pair(subject, function (key, value)
		{
			return callback.call(scope, value);
		})
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter.value = obj.filter;
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter.key = function (subject, callback, scope) {
		return obj.filter.pair(
			subject, 
			function (key)
			{
				return callback.call(scope, key);
			});
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter.pair = function (subject, callback, scope)
	{
		var filtered = {};
		
		obj.forEach.pair(
			subject, 
			function (key, value)
			{
				var res = callback.call(scope, key, value);
				
				if (is.null(res))
				{
					return false;
				}
				else if (res === true)
				{
					filtered[key] = value;
				}
			});
		
		return filtered;
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter.item = function (subject, callback, scope)
	{
		return obj.filter.pair(
			subject, 
			function (key, value)
			{
				return callback.call(scope, obj.combine(key, value));
			});
	};
	
	/**
	 * @param {Object} subject
	 * @returns {Array}
	 */
	obj.values = function (subject)
	{
		return obj
			.keys(subject)
			.reduce(
				function (result, key)
				{
					result.push(subject[key]);
					return result;
				}, 
				[]);
	};
	
	/**
	 * @param {Object} subject
	 * @returns {Array}
	 */
	obj.keys = function (subject)
	{
		return Object.keys(subject);
	};
	
	/**
	 * @param {Object} subject
	 * @returns {Array}
	 */
	obj.count = function (subject)
	{
		return obj.keys(subject).length;
	};
	
	
	this.obj = obj;
});