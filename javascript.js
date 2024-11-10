document.addEventListener('DOMContentLoaded', function() {
    const cityButton = document.getElementById('cityButton');
    const cityModal = document.getElementById('cityModal');
    const cityList = document.querySelectorAll('.modal__city-list li');
    const regionConfirm = document.getElementById('regionConfirm');
    const confirmYes = document.getElementById('confirmYes');
    const confirmChange = document.getElementById('confirmChange');
    const overlay = document.getElementById('overlay');
    const phoneInput = document.getElementById('phone');
    const consentCheckbox = document.getElementById('consent');
    const sendPromoButton = document.querySelector('.module__button1'); // Убедитесь, что это нужная кнопка
    const confirmationMessage = document.querySelector('.module__confirmation');
    const participateButton = document.querySelector('.module__button');

    // Находим секцию "module--info"
    const infoSection = document.querySelector('.module--info');

    // Список уже использованных номеров
    const usedPhones = new Set();

    // Обновленная функция валидации номера телефона
    function validatePhoneNumber(phone) {
        // Проверка на корректный формат номера
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phone);
    }
    participateButton.addEventListener('click', (event) => {
        event.preventDefault();
        infoSection.scrollIntoView({ behavior: 'smooth' });
    });

    function showMessage(message, type = 'success') {
        confirmationMessage.textContent = message;
        confirmationMessage.style.display = 'block';
        
        if (type === 'success') {
            confirmationMessage.style.background = '#48CCFD';
            confirmationMessage.style.color = '#FFFFFF';
        } else if (type === 'error') {
            confirmationMessage.style.background = '#FF1079';
            confirmationMessage.style.color = '#FFFFFF';
        }
    }

    function hideMessage() {
        confirmationMessage.style.display = 'none';
    }

    function updateSendButtonState() {
        const isPhoneValid = validatePhoneNumber(phoneInput.value);
        const isConsentChecked = consentCheckbox.checked;
        
        sendPromoButton.disabled = !(isPhoneValid && isConsentChecked);
    }

    // Показываем окно подтверждения региона при загрузке страницы
    setTimeout(() => {
        regionConfirm.style.display = 'block';
        overlay.style.display = 'block';
    }, 1000);

    // Обработчик для кнопки "Да, верно"
    confirmYes.addEventListener('click', () => {
        regionConfirm.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Обработчик для кнопки "Изменить регион"
    confirmChange.addEventListener('click', () => {
        regionConfirm.style.display = 'none';
        overlay.style.display = 'none';
        cityModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Открываем модальное окно при нажатии на кнопку
    cityButton.addEventListener('click', () => {
        cityModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Закрываем модальное окно при клике вне списка городов
    cityModal.addEventListener('click', (event) => {
        if (event.target === cityModal) {
            cityModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Добавляем функционал выбора города
    cityList.forEach(city => {
        city.addEventListener('click', () => {
            cityButton.textContent = city.textContent;
            cityModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    // Закрываем модальное окно при нажатии Esc
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            cityModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Форматирование номера телефона
    phoneInput.addEventListener('input', function(e) {
        let input = e.target.value.replace(/\D/g, '');
        
        if (input.startsWith('7')) {
            input = input.slice(1);
        }
        
        let formatted = '';

        if (input.length > 0) {
            formatted = '+7 (';
            if (input.length > 0) {
                formatted += input.substring(0, 3);
                if (input.length > 3) {
                    formatted += ') ' + input.substring(3, 6);
                    if (input.length > 6) {
                        formatted += '-' + input.substring(6, 8);
                        if (input.length > 8) {
                            formatted += '-' + input.substring(8, 10);
                        }
                    }
                }
            }
        }

        e.target.value = formatted;
        hideMessage();
        updateSendButtonState();
    });

    // Обработчик чекбокса согласия
    consentCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            showMessage('Необходимо принять условия соглашения', 'error');
        } else {
            hideMessage();
        }
        updateSendButtonState();
    });

    sendPromoButton.addEventListener('click', function() {
        // Проверка согласия
        if (!consentCheckbox.checked) {
            showMessage('Необходимо принять условия соглашения', 'error');
            return;
        }

        // Проверка номера телефона
        const phone = phoneInput.value;
        if (!validatePhoneNumber(phone)) {
            showMessage('Введите корректный номер телефона', 'error');
            return;
        }

        // Проверка на повторный номер
        if (usedPhones.has(phone)) {
            showMessage('На этот номер уже выслан промокод, на один номер можно получить один промокод.', 'error');
            return;
        }

        // Успешная отправка
        usedPhones.add(phone);
        showMessage('Промокод выслан на ваш номер', 'success');
    });

    // Прокрутка к секции "module--info" при нажатии на кнопку "Принять участие"
    sendPromoButton.addEventListener('click', (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение кнопки
        infoSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Инициализация состояния кнопки
    updateSendButtonState();
});