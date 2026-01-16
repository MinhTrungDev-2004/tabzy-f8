function Tabzy(selector) {
    this.container = document.querySelector(selector);
    console.log(this.container);
    if (!this.container) {
        console.error(`Tabzy: No container found for selector ${selector}`);
        return;
    }

    this.tabs = Array.from(this.container.querySelectorAll("a"));
    if (!this.tabs) {
        console.error(`Tabzy: No tabs found for selector ${selector}`);
        return;
    }
    console.log(this.tabs);

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                hasError = true;
                console.error(
                    `Tabzy: No panel found for tab ${tab.getAttribute("href")}`
                );
            }
            return panel;
        })
        .filter(Boolean);
    if (this.tabs.length !== this.panels.length) return;
    console.log(this.panels);

    this._originalHTML = this.container.innerHTML;
    this._init();
}

Tabzy.prototype._init = function () {
    this._activeTab(this.tabs[0]);
    this.tabs.forEach((tab) => {
        tab.onclick = (event) => {
            this._handleTabClick(event, tab);
        };
    });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();
    this._activeTab(tab);
};

Tabzy.prototype._activeTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabzy--active");
    });

    tab.closest("li").classList.add("tabzy--active");

    this.panels.forEach((panel) => (panel.hidden = true));
    console.log(tab);

    const panelActive = document.querySelector(tab.getAttribute("href"));
    console.log(panelActive);
    panelActive.hidden = false;
};

Tabzy.prototype.switch = function (input) {
    let tabToActive = null;
    if (typeof input === "string") {
        tabToActive = this.tabs.find(
            (tab) => tab.getAttribute("href") === input
        );

        if (!tabToActive) {
            console.error(`Tabzy: No panel found with ID ${input}`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActive = input;
    }

    if (!tabToActive) {
        console.log(`Tabzy: Invalid input ${input}`);
    }

    this._activeTab(tabToActive);
};

Tabzy.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => (panel.hidden = false));
    this.container = null;
    this.tabs = null;
    this.panels = null;
};
