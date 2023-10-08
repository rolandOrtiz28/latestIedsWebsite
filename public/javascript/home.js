

// Mapbox function
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9sYW5kMjgiLCJhIjoiY2xnNWtncThtMDRjajNnbGpxcWZ5ZWtlbCJ9.HrvXqgj8TXitDWQVAnHyew';
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [105.053994, 11.123324],
    zoom: 15
});


const marker1 = new mapboxgl.Marker()
    .setLngLat([105.053994, 11.123324])
    .addTo(map);



// Gsap


const projectSection = document.querySelector('.card');
const projectAnim = gsap.timeline({
    scrollTrigger: {
        trigger: projectSection,
        toggleActions: "restart pause resume reset",
        start: '200px bottom',
        end: 'bottom top',
        
    }
});
projectAnim.from(".card", {
    duration: 2,
    scale: 0.5,
    opacity: 0,
    delay: 0.5,
  
    stagger: 0.2,
    ease: "elastic",
    force3D: true
});


const logoAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".logo2", 
      start: "-100px center", 
      end: "center center", 
      scrub: 2, 

    },
  });
  
  // Add your animation to the timeline
  logoAnimation.from(".logo2", { opacity: 0, duration:1, delay: 1 });

const principle = gsap.timeline({
    scrollTrigger: {
      trigger: ".principlesTitle", 
      start: "-100px center", 
      end: "center center", 
      scrub: 1, 
    
    },
  });
  
  // Add your animation to the timeline
  principle.from(".principlesTitle", { opacity: 0, duration:1, delay: 2 });

const vision = gsap.timeline({
    scrollTrigger: {
      trigger: ".principlesTitle", 
      start: "-400px center", 
      end: "center center", 
      scrub: 1, 
    
    },
  });
  
  // Add your animation to the timeline
  vision.from(".VisionTitle", { opacity: 0, duration:1, delay: 2 });
  vision.from(".vision", { opacity: 0, duration:1, delay: 2 });
  vision.from(".MissionTitle", { opacity: 0, duration:1, delay: 2 });
  vision.from(".mission", { opacity: 0, duration:1, delay: 2 });



  const contactSection = document.querySelector('.contact');
const projectAnim2 = gsap.timeline({
    scrollTrigger: {
        trigger: contactSection,
        toggleActions: "restart pause resume reset",
        start: '-50px bottom',
        end: 'bottom top',

    }
});
projectAnim2.from(".contact", {
    duration: 2,
    scale: 0.5,
    opacity: 0,
    delay: 0.5,
  
    stagger: 0.2,
    ease: "elastic",
    force3D: true
});