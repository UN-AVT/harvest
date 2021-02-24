/*

 +-+-+-+-+-+-+-+
 |H|A|R|V|E|S|T|
 +-+-+-+-+-+-+-+

 The Analytics & Visualization Toolkit
*/

"use strict";

/**
* Class for creating multi inheritance semantics
*
* @param array The classes to inherit from
* @return a composit class
*/
H.Multi = class {
	// Inherit method to create base classes.
	static inherit(..._bases)
	{
		class classes {

			// The base classes
  			get base() { return _bases; }

			constructor(..._args)
			{
				var index = 0;

				for (let b of this.base)
				{
					let obj = new b(_args[index++]);
   					H.Multi.copy(this, obj);
				}
			}

		}

		// Copy over properties and methods
		for (let base of _bases)
		{
   			H.Multi.copy(classes, base);
   			H.Multi.copy(classes.prototype, base.prototype);
		}

		return classes;
	}

	// Copies the properties from one class to another
	static copy(_target, _source)
	{
    		for (let key of Reflect.ownKeys(_source))
			{
        		if (key !== "constructor" && key !== "prototype" && key !== "name")
				{
	        	    let desc = Object.getOwnPropertyDescriptor(_source, key);
	        	    Object.defineProperty(_target, key, desc);
        		}
    		}
	}
}

H.Object = class  {
	/**
  * Writes text to console pending config log level
  *
  * @param unknown Items to print
  * @return none
  */
  log(...msg){
		let txt = msg.join(' ');
    if (this.v == undefined || this.v.logLevel == 'log')
      console.log(txt)
  }


	/**
  * Writes text to console pending config log level
  *
  * @param unknown Items to print
  * @return none
  */
  warn(...msg) {
		let txt = msg.join(' ');
    if (this.v == undefined || this.v.logLevel == 'warn' || this.v.logLevel == 'log')
      console.warn(txt)
  }

	/**
  * Writes text to console pending config log level
  *
  * @param unknown Items to print
  * @return none
  */
  error(...msg) {
		let txt = msg.join(' ');
    if (this.v == undefined || this.v.logLevel == 'error' || this.v.logLevel == 'warn' || this.v.logLevel == 'log')
      console.error(txt)
  }

	/**
  * Creates a hash which serves as a config name
  *
  * @param object The  cfg
  * @return hash value
  */
	hash(s) {
		var hash = 0, i, chr;
		for (i = 0; i < s.length; i++) {
			chr   = s.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}
}
