const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

//-------------------------------------------------------------------------------------------------------------------------

// mouse folower fade code
window.addEventListener('mouseout', function(e) {
    // Only fade if the mouse leaves the window, not just a child element
    if (!e.relatedTarget && !e.toElement) {
        document.getElementById('minicircle').style.opacity = '0';
    }
});

window.addEventListener('mousemove', function(e) {
    document.getElementById('minicircle').style.opacity = '1';
    // Move minicircle to e.clientX, e.clientY as usual
});

function circleflat() {
    const minicircle = document.getElementById('minicircle');

    let prevX = null,
        prevY = null,
        timeoutId;

    window.addEventListener('mousemove', (e) => {

        if (prevX === null || prevY === null) {
            prevX = e.clientX;
            prevY = e.clientY;
        }

        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;


        // base movement-driven scales (1..1.5)
        const xscale = gsap.utils.clamp(1, 1.5, Math.abs(deltaX));
        const yscale = gsap.utils.clamp(1, 1.5, Math.abs(deltaY));

        // read hover multiplier (set by hover listeners). default = 1
        const hoverMul = parseFloat(minicircle.dataset.hover || '1') || 1;

        gsap.to(minicircle, {
            duration: 0.18,
            x: e.clientX,
            y: e.clientY,
            // multiply movement scale by hover multiplier so hover growth isn't stomped
            scaleX: xscale * hoverMul,
            scaleY: yscale * hoverMul,
            ease: "power3.out"
        });

        prevX = e.clientX;
        prevY = e.clientY;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            // honor current hover multiplier when easing back to resting scale
            const hoverMulTimeout = parseFloat(minicircle.dataset.hover || '1') || 1;
            gsap.to(minicircle, {
                duration: 0.28,
                scaleX: 1 * hoverMulTimeout,
                scaleY: 1 * hoverMulTimeout,
                ease: "power3.out"
            });
        }, 100);
    });
}

function mousefollower(xscale , yscale){
    window.addEventListener("mousemove",function(data){
        document.querySelector("#minicircle").style.transform = `translate(${data.clientX}px , ${data.clientY}px) scale(${xscale}) scale(${yscale})`;
    })
}

// const hoverElements = document.querySelectorAll('button, a, h1, h3, h4,h5');

//     hoverElements.forEach(el => {
//         // Enlarge follower on mouse enter
//         el.addEventListener('mouseenter', () => {
//             gsap.to(follower, {
//                 duration: 0.2,
//                 scale: 1.5 // Adjust the size as you like
//             });
//         });

//         // Shrink follower on mouse leave
//         el.addEventListener('mouseleave', () => {
//             gsap.to(follower, {
//                 duration: 0.2,
//                 scale: 1
//             });
//         });
//     });

const follower = document.getElementById('minicircle');
if (follower) {
    const hoverElements = document.querySelectorAll('button, a, h1, h3, h4, h5, span');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // mark hover multiplier so movement tweens multiply by this value
            follower.dataset.hover = '2';
            // immediately animate to the hovered size for responsiveness
            gsap.to(follower, { duration: 0.12, scaleX: 1.6, scaleY: 1.6, ease: 'power3.out' });
        });

        el.addEventListener('mouseleave', () => {
            follower.dataset.hover = '1';
            gsap.to(follower, { duration: 0.12, scaleX: 1, scaleY: 1, ease: 'power3.out' });
        });
    });
}

circleflat();

// UNDERLINE ANIMATION ------------------------------------------------------------------------

function setupAnimatedUnderline() {
  // Select all text elements except h1 and h2
  const textElems = document.querySelectorAll('h2, h4, h6, a, li');

  textElems.forEach(elem => {
    // Add the base class for underline styling
    elem.classList.add('animated-underline');

    elem.addEventListener('mouseenter', () => {
      elem.classList.remove('underline-off');
      elem.classList.add('underline-on');
    });

    elem.addEventListener('mouseleave', () => {
      elem.classList.remove('underline-on');
      elem.classList.add('underline-off');
    });
  });
}

// Call this once after DOM ready
setupAnimatedUnderline();

// second section ----------------------------------------------------------------------------

// images 

// image appear/disappear code for .elem and .elem-last
document.querySelectorAll(".elem, .elem-last").forEach(function(elem){
    var rotate = 0;
    var differ = 0;
    
    // Mouse enter - show image
    elem.addEventListener("mouseenter",function(details){
        gsap.to(elem.querySelector("img"),{
            opacity: 1,
            ease: Power3,
            duration: 0.15,
        })
    })
    
    // Mouse leave - hide image
    elem.addEventListener("mouseleave",function(details){
        gsap.to(elem.querySelector("img"),{
            opacity: 0,
            ease: Power3,
            duration: 0.15,
        })
    })
    
    // Mouse move - follow cursor
    elem.addEventListener("mousemove",function(details){
        var img = elem.querySelector("img");
        var imgW = img.offsetWidth;
        var imgH = img.offsetHeight;
        var elemRect = elem.getBoundingClientRect();

        // Mouse position relative to element
        var mouseX = details.clientX - elemRect.left;
        var mouseY = details.clientY - elemRect.top;

        differ = mouseX - rotate;
        rotate = mouseX;

        gsap.to(img,{
            ease: Power3,
            left: mouseX - imgW/2,
            top: mouseY - imgH/2,
            rotate: gsap.utils.clamp(-20, 20, differ)
        });
    });
});

// new code

// Images hover-follow feature for #Second .elem
// (() => {
//   const elems = document.querySelectorAll('#Second .elem');
//   if (!elems.length) return;

//   const allImgs = document.querySelectorAll('#Second .elem img');
//   let currentImg = null;

//   // Initialize images hidden and elements positioned for absolute children
//   elems.forEach(elem => {
//     const img = elem.querySelector('img');
//     if (!img) return;
//     elem.style.position = 'relative';        // ensure positioning context
//     img.style.position = 'absolute';
//     img.style.top = '0';
//     img.style.left = '0';
//     img.style.opacity = '0';
//     img.style.pointerEvents = 'none';        // prevent mouse capture
//     gsap.set(img, { x: 0, y: 0, scale: 0.95 }); // start slightly smaller
//   });

//   function hideOtherImages(except) {
//     allImgs.forEach(other => {
//       if (other !== except) {
//         gsap.killTweensOf(other);
//         gsap.to(other, { opacity: 0, duration: 0.12, ease: 'power3.in' });
//       }
//     });
//   }

//   elems.forEach(elem => {
//     const img = elem.querySelector('img');
//     if (!img) return;

//     elem.addEventListener('mouseenter', (e) => {
//       hideOtherImages(img);
//       gsap.killTweensOf(img);
//       // Position at entry point for no jump
//       const rect = elem.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       gsap.set(img, {
//         x: x - (img.offsetWidth / 2 || 0),
//         y: y - (img.offsetHeight / 2 || 0)
//       });
//       gsap.to(img, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' });
//       currentImg = img;
//     });

//     elem.addEventListener('mousemove', (e) => {
//       if (currentImg !== img) return; // only move the active one
//       const rect = elem.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       gsap.to(img, {
//         x: x - (img.offsetWidth / 2 || 0),
//         y: y - (img.offsetHeight / 2 || 0),
//         duration: 0.18,
//         ease: 'power3.out'
//       });
//     });

//     elem.addEventListener('mouseleave', () => {
//       if (currentImg === img) currentImg = null;
//       gsap.killTweensOf(img);
//       gsap.to(img, { opacity: 0, scale: 0.97, duration: 0.12, ease: 'power3.in' });
//     });
//   });
// })();

// // Images hover-follow feature for #Second .elem (adds rotation up to ±20deg while moving)
// (() => {
//   const elems = document.querySelectorAll('#Second .elem');
//   if (!elems.length) return;

//   const allImgs = document.querySelectorAll('#Second .elem img');
//   let currentImg = null;
//   const ROT_MAX = 20;

//   // Initialize images hidden and elements positioned for absolute children
//   elems.forEach(elem => {
//     const img = elem.querySelector('img');
//     if (!img) return;
//     elem.style.position = 'relative';        // ensure positioning context
//     img.style.position = 'absolute';
//     img.style.top = '0';
//     img.style.left = '0';
//     img.style.opacity = '0';
//     img.style.pointerEvents = 'none';        // prevent mouse capture
//     gsap.set(img, { x: 0, y: 0, scale: 0.95, rotate: 0, transformOrigin: '50% 50%' });
//   });

//   function hideOtherImages(except) {
//     allImgs.forEach(other => {
//       if (other !== except) {
//         gsap.killTweensOf(other);
//         gsap.to(other, { opacity: 0, duration: 0.12, ease: 'power3.in' });
//       }
//     });
//   }

//   elems.forEach(elem => {
//     const img = elem.querySelector('img');
//     if (!img) return;

//     let lastX = null;

//     elem.addEventListener('mouseenter', (e) => {
//       hideOtherImages(img);
//       gsap.killTweensOf(img);
//       const rect = elem.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       lastX = x;

//       gsap.set(img, {
//         x: x - (img.offsetWidth / 2 || 0),
//         y: y - (img.offsetHeight / 2 || 0),
//         rotate: 0
//       });
//       gsap.to(img, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' });
//       currentImg = img;
//     });

//     elem.addEventListener('mousemove', (e) => {
//       if (currentImg !== img) return; // only move the active one
//       const rect = elem.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       // Compute horizontal delta to derive rotation angle
//       const dx = lastX == null ? 0 : x - lastX;
//       lastX = x;
//       const angle = gsap.utils.clamp(-ROT_MAX, ROT_MAX, dx); // max ±20deg

//       gsap.to(img, {
//         x: x - (img.offsetWidth / 2 || 0),
//         y: y - (img.offsetHeight / 2 || 0),
//         rotate: angle,
//         duration: 0.18,
//         ease: 'power3.out'
//       });
//     });

//     elem.addEventListener('mouseleave', () => {
//       if (currentImg === img) currentImg = null;
//       gsap.killTweensOf(img);
//       gsap.to(img, { opacity: 0, scale: 0.97, rotate: 0, duration: 0.12, ease: 'power3.in' });
//     });
//   });
// })();
