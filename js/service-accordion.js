document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".fng-service-accordion-item");

    const closeItem = (item) => {
        const trigger = item.querySelector(".fng-service-accordion-trigger");
        const panel = item.querySelector(".fng-service-accordion-panel");

        trigger.setAttribute("aria-expanded", "false");
        panel.classList.remove("is-open");
        panel.style.maxHeight = "0px";
    };

    const openItem = (item) => {
        const trigger = item.querySelector(".fng-service-accordion-trigger");
        const panel = item.querySelector(".fng-service-accordion-panel");

        trigger.setAttribute("aria-expanded", "true");
        panel.classList.add("is-open");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
    };

    items.forEach((item) => {
        const trigger = item.querySelector(".fng-service-accordion-trigger");

        trigger.addEventListener("click", () => {
            const isOpen = trigger.getAttribute("aria-expanded") === "true";

            items.forEach(closeItem);

            if (!isOpen) {
                openItem(item);
            }
        });
    });

    window.addEventListener("resize", () => {
        items.forEach((item) => {
            const trigger = item.querySelector(".fng-service-accordion-trigger");
            const panel = item.querySelector(".fng-service-accordion-panel");

            if (trigger.getAttribute("aria-expanded") === "true") {
                panel.style.maxHeight = `${panel.scrollHeight}px`;
            }
        });
    });
});
