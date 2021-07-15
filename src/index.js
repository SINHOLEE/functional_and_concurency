const products = [
	{
		name: '반팔티',
		price: 15000,
		quantity: 1,
		selected: true,
	},
	{
		name: '긴팔티',
		price: 20000,
		quantity: 2,
		selected: false,
	},
	{
		name: '핸드폰케이스',
		price: 15000,
		quantity: 3,
		selected: true,
	},
	{
		name: '후드티',
		price: 30000,
		quantity: 4,
		selected: false,
	},
	{
		name: '바지',
		price: 25000,
		quantity: 5,
		selected: false,
	},
	{
		name: '반팔티',
		price: 15000,
		quantity: 1,
		selected: true,
	},
	{
		name: '긴팔티',
		price: 20000,
		quantity: 2,
		selected: false,
	},
	{
		name: '핸드폰케이스',
		price: 15000,
		quantity: 3,
		selected: true,
	},
	{
		name: '후드티',
		price: 30000,
		quantity: 4,
		selected: false,
	},
	{
		name: '바지',
		price: 25000,
		quantity: 5,
		selected: false,
	},
	{
		name: '반팔티',
		price: 15000,
		quantity: 1,
		selected: true,
	},
	{
		name: '긴팔티',
		price: 20000,
		quantity: 2,
		selected: false,
	},
	{
		name: '핸드폰케이스',
		price: 15000,
		quantity: 3,
		selected: true,
	},
	{
		name: '후드티',
		price: 30000,
		quantity: 4,
		selected: false,
	},
	{
		name: '바지',
		price: 25000,
		quantity: 5,
		selected: false,
	},
];

const Product = {};
// db에서 가져오는 함수
const delay = (time, a) =>
	new Promise((resolve) =>
		setTimeout(() => {
			resolve(a);
		}, time),
	);

// hoc
const withLog = (f) => (a) => {
	console.log('call1', a);
	console.log('call1');
	return f(a);
};
const withLog2 = (f) => (a) => {
	console.log('call2', a);
	console.log('call2');
	return f(a);
};
Product.list = () => products;
Product.list700 = (a) => delay(700, products);
Product.list1700 = (a) => delay(1700, products);
Product.list200 = (a) => delay(200, products);
const Products200WithLog = withLog(Product.list200);
const Products1700WithLog = withLog2(withLog(Product.list1700));
const Products700WithLog = withLog(Product.list700);
Product.list.templ = (products) => `
  <table class="table">
        <tr>
            <td>이름</td>
            <td>가격</td>
            <td>수량</td>
            <td>합계</td>
        </tr>
        ${products
			.map(
				(p) => `
          <tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
            <td>${p.quantity * p.price}</td>
          </tr>
        `,
			)
			.join('')}
    </table>
    `;
const el = (html) => {
	const wrap = document.createElement('div');
	wrap.innerHTML = html;
	return wrap.children[0];
};
const $ = (sel, parent = document) => parent.querySelector(sel);
/**
 * parent에 child를 aapend하고, child를 반환
 */
const append = (parent, child) => (parent.appendChild(child), child);

const editClass = (method) => (name, el) => {
	el.classList[method](name);
	return el;
};
const addClass = editClass('add');
const removeClass = editClass('remove');

/**
 * 반환값을 변경 ex-> 기존에는 마지막 인자를 반환했는데, 첫번째 인자를 반환하도록 바꿈
 */
const tap =
	(f) =>
	(a, ...bs) => {
		f(a, ...bs);
		return a;
	};
const attachTo = tap(append);
const clear = (target) => ($(target) ? $(target).remove() : target);
// 비동기로 만들어야 동작이 가능/// -> 랜더링과 비동기 콜스택의 관계 다시한번 보자 브라우저의 동작원리
const show1 = (el) => {
	// 쇼를 해서 el변경 후 그대로 가지고 있는것이 아니고 el을 리턴으로 넘겨준다.

	setTimeout(() => {
		removeClass('hide', el);
	}, 0);
	return el;
};

const requestAnimationFrameWrapper = (f) => (el) => {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			f(el);
			requestAnimationFrame(() => {
				resolve(el);
			});
		});
	});
};
const show = requestAnimationFrameWrapper((el) => removeClass('hide', el));

// page 컴포넌트
// 랜더링하는 함수들이 한 콜스택에서 발생하면 머지하기때문에 의도한 동작이 나타나지 않는다...?
const openPage = async (title, dataFn, templFn) => {
	// 파이프라인을 통과하듯이? 원하는 값을 만든다...?
	show(
		append(
			$('body'),
			el(`
                <div class="page hide">
                    <h2 class="title">${title}</h2>
                    <div class="content">${templFn(await dataFn())}</div>
                    </div>
                    `),
		),
	);
};
const openPage2 = async (title, dataFn, templFn) => {
	// 파이프라인을 통과하듯이? 원하는 값을 만든다...?
	// await 사용하지 않고 즉시실행
	const dataPromise = dataFn();
	const page = show(
		append(
			$('body'),
			el(`
            <div class="page hide">
                <h2 class="title">${title}</h2>
                <div class="content"></div>
                </div>
                `),
		),
	);

	append($('.content', page), el(templFn(await dataPromise)));
};
const openPage3 = async (title, dataFn, templFn) => {
	// 파이프라인을 통과하듯이? 원하는 값을 만든다...?
	// await 사용하지 않고 즉시실행
	const dataP = dataFn();
	// show가 끝나는 시점을 알아야한다. 근데 어떻게 알지?
	const pageP = show(
		append(
			$('body'),
			el(`
            <div class="page hide">
                <h2 class="title">${title}</h2>
                <div class="content"></div>
                </div>
                `),
		),
	);
	const [page, data] = await Promise.all([pageP, dataP]);
	show(
		tap(append)(
			//
			addClass('hide', $('.content', page)),
			el(templFn(await data)),
		),
	);
};

const options = {loading: true};
const openPage4 = async (title, dataFn, templFn, options = {loading: true}) => {
	// 파이프라인을 통과하듯이? 원하는 값을 만든다...?
	// await 사용하지 않고 즉시실행
	// show가 끝나는 시점을 알아야한다. 근데 어떻게 알지?
	const pageP = await show(
		append(
			$('body'),
			el(`
            <div class="page hide">
            <h2 class="title">${title}</h2>
            <div class="content"></div>
            </div>
            `),
		),
	);
	// loading 시점
	const dataP = dataFn(123);
	console.log({dataP});

	if (options.loading) {
		show(
			tap(append)(
				//
				addClass('hide', $('.content', pageP)),
				el(`<div class="loading">Loading...</div>`),
			),
		);

		// 본페이지 보여주는 시점
		const [page, data] = await Promise.all([pageP, dataP]);
		console.log({data});
		clear('.loading');
	}

	show(
		tap(append)(
			//
			addClass('hide', $('.content', pageP)),
			el(templFn(await dataP)),
		),
	);
};

const debounce = (delay, f) => {
	let timer = null;
	return (...args) => {
		if (timer) {
			clearTimeout(timer);
		}
		return new Promise((res) => {
			timer = setTimeout(() => res(f.call(this, ...args)), delay);
		});
	};
};
const throttle = (delay, f) => {
	let timer = null;
	return (...args) => {
		if (timer) {
			return;
		}
		return new Promise((res) => {
			timer = setTimeout(() => {
				res(f.call(this, ...args));
				timer = null;
			}, delay);
		});
	};
};
const debouncedProducts = debounce(1000, Products1700WithLog);

// 15분 20초에서 다시시작
// el을 받고 el을 다시 반환

const openTitle = async (title) => {
	const pageP = await show(
		append(
			$('body'),
			el(`
            <div class="page hide">
                <h2 class="title">${title}</h2>
                <div class="content"></div>
                <div class="loading">Loading...</div>
                </div>
                `),
		),
	);
	return pageP;
};
const openContent = async (pageP, dataFn, templFn, options = {loading: true}) => {
	const dataP = dataFn(123);

	clear('.loading');
	clear('.table');
	if (options.loading) {
		show(
			tap(append)(
				//
				addClass('hide', $('.content', pageP)),
				el(`<div class="loading">Loading...</div>`),
			),
		);

		// 본페이지 보여주는 시점
		const [data] = await Promise.all([dataP]);
		console.log('throttle: ', {data});
		clear('.loading');
		clear('.table');
	}

	show(
		tap(append)(
			//
			addClass('hide', $('.content', pageP)),
			el(templFn(await dataP)),
		),
	);
};

const throttledOpenContent = throttle(1000, openContent);
document.addEventListener('DOMContentLoaded', () => {
	console.log('loaded');
	openTitle('상품 목록').then((page) =>
		throttledOpenContent(page, debouncedProducts, Product.list.templ),
	);
});
document.addEventListener('keypress', () => {
	throttledOpenContent($('.page'), debouncedProducts, Product.list.templ);
	// clear('.page');
	// openPage4('상품 목록', debouncedProducts, Product.list.templ);
	// openPage2('상품 목록', Products1700WithLog, Product.list.templ);
	// openPage3('상품 목록', Products1700WithLog, Product.list.templ);
	// openPage4('상품 목록', Products1700WithLog, Product.list.templ);
});
