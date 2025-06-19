//#region Workers
/******Workers Code********/
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/service-worker.js');
}

//#endregion Workers


//#region HomeContent
class Code {
    constructor() {
        this.home = document.getElementsByClassName("home")[0];
        this.content = document.getElementsByClassName("content")[0];
        this.installButton = document.getElementsByClassName("pr-install")[0];
        this.onContent()

        if ('BeforeInstallPromptEvent' in window) {
            //this.onHome();
            let installEvent = null;

            const onInstall = () => {
                this.installButton.disabled = true;
                installEvent = null;
            };

            window.addEventListener('beforeinstallprompt', (event) => {
                event.preventDefault();
                installEvent = event;
                this.installButton.disabled = false;
            });

            this.installButton.addEventListener('click', async () => {
                if (!installEvent) {
                    return;
                }

                installEvent.prompt();
                const result = await installEvent.userChoice;
                if (result.outcome === 'accepted') {
                    onInstall();
                    this.onContent();
                }
            });

            // The user can decide to ignore the install button
            // and just use the browser prompt directly. In this case
            // likewise run `onInstall()`.
            window.addEventListener('appinstalled', () => {
                onInstall();
            });
        }
        this.menu_install = document.getElementsByClassName("liNav-install")[0].lastElementChild
        this.menu_list = document.getElementsByClassName("liNav-list")[0].lastElementChild
        console.log("menu")
        console.log(this.menu_install)
        console.log(this.menu_list)

        this.menu_install.addEventListener('click', (event) => {
            this.onHome()
        })

        this.menu_list.addEventListener('click', (event) => {
            this.onContent()
        })
    }

    onHome() {
        this.content.setAttribute("Style", "Display: none");
        this.home.setAttribute("Style", "Display: block");
    }

    onContent() {
        this.home.setAttribute("Style", "Display: none");
        this.content.setAttribute("Style", "Display: block");
    }
   
}
const helper = new Code()
//#endregion