export class Property {
	
	static num(value, min = -Infinity, max = Infinity, flag = 0, defaultValue = 0, coefficient = 1) {
		
		const { toNaNaN } = Property;
		
		value = typeof coefficient === 'function' ? coefficient(value, min, max, flag, defaultValue, coefficient) :
			((value = toNaNaN(value, defaultValue) * toNaNaN(coefficient, 1)) < min ? min : value > max ? max : value),
		
		flag & Property.IS_INTEGER && value !== Infinity && (value = value|0),
		value < 0 && (flag & Property.IS_UNSIGNED && (value = min > 0 ? min : 0));
		
		return value;
		
	}
	static toNaNaN(value, defaultValue) {
		
		return Number.isNaN(value = +value) ? defaultValue : value;
		
	}
	static normalize(value, flag, defaultValue) {
		
		return Property.num(value, value, value, flag, defaultValue);
		
	}
	
	static {
		
		this.IS_INTEGER = 1,
		this.IS_UNSIGNED = 2;
		
	}
	
	constructor(value, min, max, flag, defaultValue, coefficient) {
		
		this.set(...arguments);
		
	}
	
	valueOf() {
		
		return Property.num(this.value, this.min, this.max, this.flag, this.defaultValue, this.coefficient);
		
	}
	
	get() {
		
		return +this;
		
	}
	set(
		value,
		min = this.min ?? -Infinity,
		max = this.max ?? Infinity,
		flag = this.flag ?? 0,
		defaultValue = this.defaultValue,
		coefficient = this.coefficient ?? 1
	) {
		
		arguments.length === 1 || (
				
				this.setMin(min),
				this.setMax(max),
				
				this.flag = flag,
				this.defaultValue = defaultValue,
				this.coefficient = coefficient
				
			);
		
		return this.value = Property.num(value, this.min, this.max, this.flag, this.defaultValue, this.coefficient);
		
	}
	
	setMin(value, flag, defaultValue = -Infinity) {
		
		return this.setPropertyValue('min', value, value, value, flag, defaultValue);
		
	}
	setMax(value, flag, defaultValue = Infinity) {
		
		return this.setPropertyValue('max', value, flag, defaultValue);
		
	}
	setPropertyValue(name, value, flag = this.flag, defaultValue) {
		
		return this[name] = Property.normalize(value, flag, defaultValue);
		
	}
	
	// ??????????????????????????? returnsValue ???????????????????????????????????????????????????????????? this.value ????????????????????? value ????????????
	// ????????????????????? this.value [operator] value ????????????????????????????????? inverts ???????????????????????????????????????
	// value [operator] this.value ????????????????????????????????????????????????????????????????????????
	add(value, returnsValue, inverts) {
		
		return this.cal('+', value, returnsValue, inverts);
		
	}
	sub(value, returnsValue, inverts) {
		
		return this.cal('-', value, returnsValue, inverts);
		
	}
	mul(value, returnsValue, inverts) {
		
		return this.cal('*', value, returnsValue, inverts);
		
	}
	div(value, returnsValue, inverts) {
		
		return this.cal('/', value, returnsValue, inverts);
		
	}
	cal(operator, value, returnsValue, inverts) {
		
		value = Property.num(value);
		
		const b = inverts ? this.value : value;
		let a = inverts ? value : this.value;
		
		switch (operator) {
			case 'addition': case 'add': case '+': a += b; break;
			case 'subtruct': case 'sub': case '-': a -= b; break;
			case 'multiple': case 'mul': case '*': a *= b; break;
			case 'division': case 'div': case '/': a /= b; break;
			default: a = b;
		}
		
		a = this.set(a);
		
		return returnsValue ? value : a;
		
	}
	
}

export default class Game {
	
	static executor = {
		
		browse(type) {
			
			const contents = [], { isNotLog } = Game;
			
			switch (type) {
				default:
				const content = document.createElement('iframe');
				content.src = type,
				content.sandbox = 'allow-same-origin',
				content[isNotLog] = true,
				contents[contents.length] = content;
			}
			
			return contents;
			
		}
		
	}
	
	static {
		
		this.isNotLog = Symbol('Game.isNotLog');
		
		this.GlobalPropertyFlag = Property.IS_INTEGER + Property.IS_UNSIGNED,
		this.GlobalCoefficient = new Property(1);
		
		const { create, browse } = this.executor;
		
		this.command = {
			
			browse
			
		};
		
	}
	
	constructor() {
		
		this.instance = new Instance();
		
	}
	
	execute(executor, args) {
		
		const	{ command } = Game,
				exe = executor in command ? command : `No command such "${executor}".`,
				result = typeof exe === 'function' ? exe.apply(this, args) : exe;
		
		return result;
		
	}
	
}

export class Instance {
	
	static {
		
	}
	
	constructor() {
		
		
	}
	
}