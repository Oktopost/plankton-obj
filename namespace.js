'use strict';


const Namespace = require('oktopost-namespace');
const is = require('oktopost-plankton-is').is;


const container = {
	Plankton: {
		is: is
	}
};

const Plankton = new Namespace(container);


module.exports = {
	Plankton: container.Plankton,
	namespace: Plankton.getCreator()
};