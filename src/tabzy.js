function Tabzy(selector, options = {}) {
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
                    `Tabzy: No panel found for tab ${tab.getAttribute("href")}`,
                );
            }
            return panel;
        })
        .filter(Boolean);
    if (this.tabs.length !== this.panels.length) return;

    this.paramKey = selector.replace(/[^a-zA-Z0-9]/g, "");
    console.log("Panels");
    console.log(this.panels);

    this.opt = Object.assign(
        {
            remember: false,
            onChange: null,
        },
        options,
    );

    this._originalHTML = this.container.innerHTML;
    this._init();
}

Tabzy.prototype._init = function () {
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get(this.paramKey);
    const tab =
        (this.opt.remember &&
            tabSelector &&
            this.tabs.find(
                (tab) =>
                    tab.getAttribute("href").replace(/[^a-zA-Z0-9]/g, "") ===
                    tabSelector,
            )) ||
        this.tabs[0];

    this.currentTab = tab;
    this._activateTab(tab, false);
    this.tabs.forEach((tab) => {
        tab.onclick = (event) => {
            this._handleTabClick(event, tab);
        };
    });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();
    if (tab === this.currentTab) {
        this._activateTab(tab, false);
    } else {
        this._activateTab(tab, true);
        this.currentTab = tab;
    }
};

Tabzy.prototype._activateTab = function (tab, triggerOnChange = true) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabzy--active");
    });

    tab.closest("li").classList.add("tabzy--active");

    this.panels.forEach((panel) => (panel.hidden = true));
    // console.log(tab);

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if (this.opt.remember) {
        const params = new URLSearchParams(location.search);
        const paramValue = tab
            .getAttribute("href")
            .replace(/[^a-zA-Z0-9]/g, "");
        params.set(this.paramKey, paramValue);
        history.replaceState(null, null, `?${params}`);
    }

    if (typeof this.opt.onChange === "function" && triggerOnChange) {
        this.opt.onChange({
            tab,
            panel: panelActive,
        });
    }
};

Tabzy.prototype.switch = function (input) {
    let tabToActivate = null;
    if (typeof input === "string") {
        tabToActivate = this.tabs.find(
            (tab) => tab.getAttribute("href") === input,
        );

        if (!tabToActivate) {
            console.error(`Tabzy: No panel found with ID ${input}`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActivate = input;
    }

    if (!tabToActivate) {
        console.log(`Tabzy: Invalid input ${input}`);
    }
    if (this.currentTab !== tabToActivate) {
        this.currentTab = tabToActivate;
        this._activateTab(tabToActivate);
    }
};

Tabzy.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => (panel.hidden = false));
    this.container = null;
    this.tabs = null;
    this.panels = null;
};
