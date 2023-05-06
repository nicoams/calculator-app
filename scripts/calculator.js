window.calculator = new CalculatorController();
const html = document.documentElement;
const radioBtns = document.querySelectorAll('input[name=theme]');
const osDark = window.matchMedia('(prefers-color-scheme: dark)');
const osLight = window.matchMedia('(prefers-color-scheme: light)');

function setOsTheme(preference) {
	if (preference === 'dark') {
		html.classList = 'first';
		let btnFirst = document.querySelector('#first');
		btnFirst.checked = true;
	} else {
		html.classList = 'second';
		let btnSecond = document.querySelector('#second');
		btnSecond.checked = true;
	}
}

if (osDark.matches) {
	preference = 'dark';
}

if (osLight.matches) {
	preference = 'light';
}

for (const radioBtn of radioBtns) {
	radioBtn.addEventListener('change', function () {
		if (this.checked) {
			html.classList = '';
			html.classList.add(this.id);
			const themeName = html.classList.value;
			localStorage.setItem('theme', themeName);
		}
	});
}

window.onload = () => {
	if (typeof Storage !== 'undefined') {
		const getTheme = localStorage.getItem('theme');
		if(getTheme){
			html.classList = getTheme;
			document.getElementById(getTheme).checked = true;
		} else{
			setOsTheme(preference);
		}
	}
}
