document.querySelector('.busca')
    .addEventListener('submit', async (event) => {
        event.preventDefault();

        const input = document.querySelector('#searchInput').value;
        const clearInput = input.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

        if (clearInput !== '') {
            showWarning('Carregando...');

            const url = `
                https://api.openweathermap.org/data/2.5/weather?q=
                ${encodeURI(clearInput)}&appid=b87adb94624c0be4be773df14674c0c3&units=metric&lang=pt_br`;

            const result = await fetch(url); // faz a requisição e armazena o resultado em result
            const json = await result.json(); // transforma o resultado em JSON

            if (json.cod === 200) {
                clearInfo();

                showInfo({
                    name: json.name,
                    country: json.sys.country,
                    temperature: json.main.temp,
                    temperatureMax: json.main.temp_max,
                    temperatureMin: json.main.temp_min,
                    temperatureIcon: json.weather[0].icon,
                    temperatureDescription: json.weather[0].description,
                    windSpeed: json.wind.speed,
                    windAngle: json.wind.deg,
                })
            } else {
                clearInfo();
                showWarning('Não encontramos esta localização...');
            }
        } else {
            clearInfo();
        }
    });

function showInfo(json) {
    showWarning(''); // tira a mensagem da tela

    document.querySelector('.titulo').innerHTML = `${json.name}, ${json.country}`;
    document.querySelector('.tempInfo').innerHTML = `${json.temperature} <sup>ºC</sup>`;
    document.querySelector('.tempInfoMax').innerHTML = `${json.temperatureMax} <sup>ºC</sup>`
    document.querySelector('.tempInfoMin').innerHTML = `${json.temperatureMin} <sup>ºC</sup>`
    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`;

    document.querySelector('.vento img').setAttribute('src',
        `http://openweathermap.org/img/wn/${json.temperatureIcon}@2x.png`);
    document.querySelector('.tempDescription').innerHTML = `${json.temperatureDescription}`;

    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windAngle - 90}deg)`;

    document.querySelector('.resultado').style.display = 'block'; // mostrar os resultados
}

function clearInfo() {
    showWarning('');
    document.querySelector('.resultado').style.display = 'none';
}

function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg;
}