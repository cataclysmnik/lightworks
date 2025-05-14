import slides from "./slides.js";
gsap.registerPlugin(CustomEase, ScrollTrigger);



document.addEventListener("DOMContentLoaded", () => {
    let activeSlideIndex = 0;
    let previousProgress = 0;
    let isAnimatingSlide = false;
    let triggerDestroyed = false;

    const customEase = CustomEase.create("custom", ".87,0,.13,1");

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const initialSlide = document.querySelector(".carousel .slide");
    gsap.set(initialSlide, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });

    initMarqueeAnimation(initialSlide.querySelector(".marquee-container h1"));

    function updateProgressBars(progress) {
        const progressBars = document.querySelectorAll(".progress-bar");
        progressBars.forEach((bar, index) => {
            const barProgress = Math.min(Math.max(progress * 11 - index, 0), 1);
            bar.style.setProperty('--progress', barProgress);
        });
    }

    function initMarqueeAnimation(h1Element) {
        // Create enough repetitions to ensure seamless loop
        const text = h1Element.textContent;
        const repetitions = Math.ceil(window.innerWidth / (text.length * 40)) + 1; // Adjust 40 based on font size
        const repeatedText = Array(repetitions).fill(text).join(" | ");
        h1Element.textContent = repeatedText;

        // Calculate duration based on text length
        const duration = repeatedText.length * 0.15; // Adjust speed multiplier as needed

        gsap.to(h1Element, {
            x: `-${100 / repetitions}%`,
            duration: duration,
            ease: "none",
            repeat: -1,
            onRepeat: () => {
                gsap.set(h1Element, { x: "0%" });
            }
        });
    }

    function createAndAnimateSlide(index, isScrollingForward) {
        const carousel = document.querySelector(".carousel");
        if (!carousel) return;

        const currentSlide = document.querySelector(".carousel .slide");
        if (!currentSlide) {
            isAnimatingSlide = false;
            return;
        }

        const slideData = slides[index];

        const newSlide = document.createElement("div");
        newSlide.className = 'slide';
        newSlide.innerHTML = `
            <div class="slide-img">
                <img src="../assets/images/slide-img-${index + 1}.jpg" />
            </div>
            <div class="slide-copy">
                <div class="slide-tag">
                    <p>${slideData.tag}</p>
                </div>
                <div class="slide-marquee">
                    <div class="marquee-container">
                        <a href="${slideData.link}" class="marquee-link">
                            <h1>${slideData.marquee}</h1>
                        </a>
                    </div>
                </div>
            </div>
        `;

        initMarqueeAnimation(newSlide.querySelector(".marquee-container h1"));

        const currentSlideImg = currentSlide.querySelector(".slide-img");
        const currentSlideCopy = currentSlide.querySelector(".slide-copy");

        if (!currentSlideImg || !currentSlideCopy) {
            isAnimatingSlide = false;
            return;
        }

        gsap.killTweensOf(currentSlide);
        gsap.killTweensOf(currentSlideImg);
        gsap.killTweensOf(currentSlideCopy);

        if (isScrollingForward) {
            const newSlideImg = newSlide.querySelector(".slide-img img");
            const newSlideCopy = newSlide.querySelector(".slide-copy");

            gsap.set(newSlide, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            });
            gsap.set(newSlideImg, { y: "25%" });
            gsap.set(newSlideCopy, { y: "100%" });

            carousel.appendChild(newSlide);

            gsap.to(newSlide, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
                duration: 1,
                ease: "power4.inOut",
            });

            gsap.to([newSlideCopy, newSlideImg], {
                y: "0%",
                duration: 1,
                ease: "power4.inOut",
            });

            gsap.to(currentSlide, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                duration: 1,
                ease: "power4.inOut",
                onStart: () => {
                    gsap.to(currentSlideImg, {
                        y: "-25%",
                        duration: 1,
                        ease: "power4.inOut"
                    });
                    gsap.to(currentSlideCopy, {
                        y: "-100%",
                        duration: 1,
                        ease: "power4.inOut",
                    });
                },
                onComplete: () => {
                    if (currentSlide.parentNode) {
                        currentSlide.remove();
                    }
                    isAnimatingSlide = false;
                },
                onInterrupt: () => {
                    isAnimatingSlide = false;
                },
            });
        } else {
            const newSlideImg = newSlide.querySelector(".slide-img img");
            const newSlideCopy = newSlide.querySelector(".slide-copy");

            gsap.set(newSlide, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            });

            gsap.set(newSlideImg, { y: "-25%" });
            gsap.set(newSlideCopy, { y: "-100%" });

            carousel.insertBefore(newSlide, currentSlide);

            gsap.to(newSlide, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 1,
                ease: "power4.inOut",
            });

            gsap.to([newSlideImg, newSlideCopy], {
                y: "0%",
                duration: 1,
                ease: "power4.inOut",
            });

            gsap.to(currentSlide, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                duration: 1,
                ease: "power4.inOut",
                onStart: () => {
                    gsap.to(currentSlideImg, {
                        y: "25%",
                        duration: 1,
                        ease: "power4.inOut",
                    });
                    gsap.to(currentSlideCopy, {
                        y: "100%",
                        duration: 1,
                        ease: "power4.inOut",
                    });
                },
                onComplete: () => {
                    if (currentSlide.parentNode) {
                        currentSlide.remove();
                    }
                    isAnimatingSlide = false;
                },
            });
        }
    }

    const scrollTrigger = ScrollTrigger.create({
        trigger: ".carousel",
        start: "top top",
        end: `+=${window.innerHeight * 15}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
            if (triggerDestroyed) return;

            const progress = self.progress;
            updateProgressBars(progress);

            if (isAnimatingSlide) {
                previousProgress = progress;
                return;
            }

            const isScrollingForward = progress > previousProgress;
            const targetSlideIndex = Math.min(Math.floor(progress * 11), 10);

            if (targetSlideIndex !== activeSlideIndex) {
                isAnimatingSlide = true;

                try {
                    createAndAnimateSlide(targetSlideIndex, isScrollingForward);
                    activeSlideIndex = targetSlideIndex;
                } catch (err) {
                    isAnimatingSlide = false;
                }
            }

            previousProgress = progress;
        },
        onKill: () => {
            triggerDestroyed = true;
        },
    });
});