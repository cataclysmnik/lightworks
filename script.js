gsap.registerPlugin(CustomEase, ScrollTrigger);

const customEase = CustomEase.create("custom", ".87,0,.13,1");
const counter = document.getElementById("counter");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

gsap.set(".video-container", {
    scale: 0,
    rotation: -20,
});

gsap.to(".hero", {
    clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
    duration: 1.5,
    ease: customEase,
    delay: 1,
});

gsap.to(".hero", {
    clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
    duration: 2,
    ease: customEase,
    delay: 3,

    onStart: () => {
        gsap.to(".progress-bar", {
            width: "100vw",
            duration: 2,
            ease: customEase,
        });

        gsap.to(counter, {
            innerHTML: 100,
            duration: 2,
            ease: customEase,
            snap: { innerHTML: 1 },
        });
    },
});

gsap.to(".hero", {
    clipPath: ("polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%"),
    duration: 1,
    ease: customEase,
    delay: 5,
    onStart: () => {
        gsap.to(".video-container", {
            scale: 1,
            rotation: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.25,
            ease: customEase,
        });

        gsap.to(".progress-bar", {
            opacity: 0,
            duration: 0.3,
        });

        gsap.to(".logo", {
            left: "0%",
            transform: "translateX(0%)",
            duration: 1.25,
            ease: customEase,

            onStart: () => {
                gsap.to(".char.anim-out h1", {
                    y: "100%",
                    duration: 3,
                    stagger: -0.1,
                    ease: customEase,
                    delay: 1.5
                });

                gsap.to(".char.anim-in h1", {
                    x: "-900%",
                    duration: 2,
                    ease: customEase,
                    delay: 2.5,
                });
            },
        });
        gsap.to(".links", {
            left: "0%",
            transform: "translateX(0%)",
            duration: 1.25,
            ease: customEase,
        });
    },

});

gsap.to([".header span", ".coordinates span"], {
    y: "0%",
    duration: 1,
    stagger: 0.125,
    ease: "power3.out",
    delay: 5.75,
});

document.querySelectorAll('a[data-value]').forEach(link => {
    link.onmouseover = event => {
        let iterations = 0;
        const interval = setInterval(() => {
            event.target.innerText = event.target.innerText.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return event.target.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * 26)]
                })
                .join("");
            if (iterations >= event.target.dataset.value.length) {
                clearInterval(interval);
            }
            iterations += 1 / 3;
        }, 30);
    }
});

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

ScrollTrigger.create({
    trigger: ".ws",
    start: "top bottom",
    end: "bottom bottom",
    scrub: 1,
    onUpdate: (self) => {
        const galleryWrapper = document.querySelector(".gallery-wrapper");
        const sideCols = document.querySelectorAll(".col:not(.main)");
        const mainImg = document.querySelector(".img.main img");
        const imageContent = document.querySelector(".image-content");

        const scale = 1 + self.progress * 2.65;
        const yTranslate = self.progress * 300;
        const mainImgScale = 2 - self.progress * 0.85;

        // Calculate opacity based on progress
        const contentOpacity = Math.max(0, (self.progress - 0.7) * 3); // Starts fading in at 70% progress

        galleryWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;

        sideCols.forEach((col) => {
            col.style.transform = `translateY(${yTranslate}px)`;
        });

        mainImg.style.transform = `scale(${mainImgScale})`;

        // Apply opacity to content
        if (imageContent) {
            imageContent.style.opacity = contentOpacity;
            imageContent.style.transform = `translate(-50%, -50%) scale(${1 + (1 - contentOpacity) * 0.2})`;
        }
    },
})

document.addEventListener("DOMContentLoaded", () => {
    const animateTextElements = (selector, splitBy) => {
        const textContainers = document.querySelectorAll(selector);

        textContainers.forEach((textContainer) => {
            const originalText = textContainer.textContent;
            let elements = [];

            // Split text into words
            if (splitBy === "words") {
                elements = originalText.trim().split(/\s+/);
            }

            // Clear and rebuild the content
            textContainer.innerHTML = elements
                .map(element => `<span class="word">${element}</span>`)
                .join(' ');

            // Get all word spans
            const words = textContainer.querySelectorAll('.word');

            // Add mouse interaction
            textContainer.addEventListener("mousemove", (e) => {
                const rect = textContainer.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                words.forEach((word) => {
                    const wordRect = word.getBoundingClientRect();
                    const wordX = wordRect.left - rect.left + wordRect.width / 2;
                    const wordY = wordRect.top - rect.top + wordRect.height / 2;

                    const distanceX = mouseX - wordX;
                    const distanceY = mouseY - wordY;
                    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    const maxDistance = 100;

                    if (distance < maxDistance) {
                        const force = (1 - distance / maxDistance) * 30;
                        const moveX = (distanceX / distance) * force;
                        const moveY = (distanceY / distance) * force;

                        gsap.to(word, {
                            x: -moveX,
                            y: -moveY,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    } else {
                        gsap.to(word, {
                            x: 0,
                            y: 0,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });
            });

            // Reset position when mouse leaves
            textContainer.addEventListener("mouseleave", () => {
                words.forEach(word => {
                    gsap.to(word, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
        });
    };

    // Initialize the animations
    animateTextElements(".intro-text", "words");
    animateTextElements(".outro-text", "words");
});