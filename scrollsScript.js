gsap.registerPlugin(ScrollTrigger);

// Select the HTML elements needed for the animation
const scrollSection = document.querySelectorAll(".scroll-section");

scrollSection.forEach((section) => {
  const wrapper = section.querySelector(".wrapper");
  const items = wrapper.querySelectorAll(".item");

  // Initialize
  let direction = null;

  // if (section.classList.contains("vertical-section")) {
  // } else if (section.classList.contains("horizontal-section")) {
  //   direction = "horizontal";
  // }
  direction = "vertical";

  initScroll(section, items, direction);
});

function initScroll(section, items, direction) {
  let num = 0
  items.forEach((item, index) => {
    num++
    if (index !== 0) {
          if(index == 1) {
            gsap.set(item, { xPercent: 200 }) 
          } else if (index == 2) {
            gsap.set(item, { yPercent: 100 }) 
          } else if(index == 3) { 
            gsap.set(item, { xPercent: -200 }) 
          }
    }

  })

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: "top top",
      end: () => `+=${items.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true,
    },
    defaults: { ease: "none" },
  });
  items.forEach((item, index) => {
    timeline.to(item, {
      scale: 0.9,
      borderRadius: "10px",
    });

    if(index == 0 || index == 2) {
      timeline.to(
        items[index + 1],
        {
          xPercent: 0,
        },
        "<"
      )
    } else {
      timeline.to(
        items[index + 1],
        {
          yPercent: 0,
        },
        "<"
      );
    }
  });
}