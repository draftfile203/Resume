import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, isPlatformBrowser, NgFor } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [NgFor,CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent implements OnInit,AfterViewInit{
  experiecnces: {
    icon?: SafeHtml;
    title: string;
    date: string;
    description: string;
  }[];

  words: { top: number; left: number }[] = [];
  showCenterWord = true;
  showExperienceSection = false;


  @ViewChildren('wordRef') wordElements!: QueryList<ElementRef>;

ngOnInit(): void {
  this.generateGrid();

  if (isPlatformBrowser(this.platformId)) {
  window.addEventListener('resize', () => {
    this.words = [];
    this.generateGrid();
  });
}

}




ngAfterViewInit() {
  if (!this.wordElements || this.wordElements.length === 0) return;

  // Glitch-like flicker for center word lasting about 1.5 seconds total (instead of ~0.5s)
  gsap.fromTo(
    '.center-word',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.1,
      repeat: 9,    // ~ 1.5 seconds / 0.1*2 per repeat) repeats for ~1.4s flicker
      yoyo: true,
      onComplete: () => {
        // Fade out immediately after glitch stops (no delay)
        gsap.to('.center-word', {
          opacity: 0,
          duration: 0.2, // a bit faster fade out
          onComplete: () => {
            this.showCenterWord = false;

            // Animate all words from center outward immediately
            this.wordElements.forEach((el, index) => {
              const word = this.words[index];
              gsap.to(el.nativeElement, {
                top: word.top + '%',
                left: word.left + '%',
                opacity: 1,
                delay: 0,        // start instantly after fade out
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                  if (index === this.words.length - 1) {
                    gsap.delayedCall(0.2, () => {
                      this.fadeOutWordsInGroups();
                    });
                  }
                }
              });
            });
          }
        });
      }
    }
  );
}



generateGrid() {
    if (!isPlatformBrowser(this.platformId)) return;

  const screenWidth = window.innerWidth

  const centerTop = 50;
  const centerLeft = 50;

  let rowSpacing: number;
  let colSpacing: number;
  let totalRows: number;
  let itemsPerRow: number;

  // Mobile: under 500px — 2x5 grid
  if (screenWidth < 500) {
    rowSpacing = 13;
    colSpacing = 30;
    totalRows = 5;
    itemsPerRow = 2;
  }
  // Small tablets/large phones: under 901px — 3x5 grid
  else if (screenWidth < 901) {
    rowSpacing = 12;
    colSpacing = 24;
    totalRows = 5;
    itemsPerRow = 3;
  }
  // Tablets
  else if (screenWidth < 1100) {
    rowSpacing = 10;
    colSpacing = 19;
    totalRows = 5;
    itemsPerRow = 4;
  }
  // Desktops
  else {
    rowSpacing = 9;
    colSpacing = 14;
    totalRows = 7;
    itemsPerRow = 5;
  }

  this.words = []; // clear previous words

  for (let r = 0; r < totalRows; r++) {
    const offset = r - Math.floor(totalRows / 2);
    const top = centerTop + offset * rowSpacing;
    const stagger = r % 2 !== 0;

    for (let c = 0; c < itemsPerRow; c++) {
      let left = centerLeft + (c - (itemsPerRow - 1) / 2) * colSpacing;

      if (stagger) left += colSpacing / 2;

    

      this.words.push({ top, left });
    }
  }
}


fadeOutWordsInGroups() {
  const wordsArray = this.wordElements.toArray();
  const totalWords = wordsArray.length;

  const indices = Array.from({ length: totalWords }, (_, i) => i);

  function shuffle(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffle(indices);

  const chunks: number[][] = [];
  let i = 0;
  while (i < totalWords) {
    const size = Math.floor(Math.random() * 2) + 5; // 3 or 4
    chunks.push(indices.slice(i, i + size));
    i += size;
  }

  let delay = 0;
  const fadeDuration = 0.3;

  chunks.forEach(chunk => {
    // Filter out any undefined elements (shouldn't happen but just in case)
    const validElements = chunk
      .map(idx => wordsArray[idx])
      .filter(el => el && el.nativeElement)
      .map(el => el.nativeElement);

    if (validElements.length === 0) {
      console.warn('No valid elements in this chunk', chunk);
      return;
    }

    gsap.to(validElements, {
      opacity: 0,
      duration: fadeDuration,
      delay,
      stagger: 0.1,
      ease: "power1.inOut"
    });

    delay += fadeDuration + 0.1;
  });
    gsap.delayedCall(delay, () => {
    this.showExperienceSection = true;

    setTimeout(() => {
      gsap.from('.works', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
      });
    }, 0);
  });
}


  constructor(private sanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId: Object) {
    this.experiecnces = [
      {
       icon: this.sanitizer.bypassSecurityTrustHtml(`
  <svg width="32" height="32" viewBox="0 0 1024 1024" fill="#ff0000" xmlns="http://www.w3.org/2000/svg">
    <path d="M512 569.2m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z"></path>
    <path d="M611.8 617.1H406.5L108 390.3v20.1l293 222.7h216l299-223.3v-20L611.8 617.1z"></path>
    <path d="M704 256.8v-94.5H320v94.5H64v605h896v-605H704z m-340-50.5h296v50.4H364v-50.4z m552 611.5H108V769h808v48.8z m0-64.9H108V300.8h808v452.1z"></path>
  </svg>
`),
        title: 'Small Business Owner',
        date: '2019 - 2020',
        description: 'Started a small business managing all aspects of operations including finance, marketing, and customer relations.'
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
          <svg width="32" height="32" viewBox="0 0 20 20" fill="#88ff00" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5.5C3 5.22 3.22 5 3.5 5H16.5C16.78 5 17 5.22 17 5.5V13.5C17 13.78 16.78 14 16.5 14H13V15H14C14.28 15 14.5 15.22 14.5 15.5C14.5 15.78 14.28 16 14 16H6C5.72 16 5.5 15.78 5.5 15.5C5.5 15.22 5.72 15 6 15H7V14H3.5C3.22 14 3 13.78 3 13.5V5.5ZM4 6V13H6H14H16V6H4ZM11 14H9V15H11V14Z" />
          </svg>
        `),
        title: 'IT Support Technician',
        date: 'Feb, 2020 - Apr, 2020',
        description: 'Provided tech support, maintained systems, and assisted users with software and hardware issues.'
      },
      {
       icon: this.sanitizer.bypassSecurityTrustHtml(`
  <svg width="32" height="32" viewBox="0 0 512 512" fill="#008cff" xmlns="http://www.w3.org/2000/svg">
    <path d="M442.031,402.197c-12.564-18.822-31.647-29.22-49.582-35.98c-8.994-3.39-17.784-5.88-25.527-7.997
      c-7.73-2.105-14.455-3.879-18.973-5.578c-7.902-2.936-16.25-6.74-22.075-10.831c-2.909-2.029-5.15-4.12-6.45-5.9
      c-1.314-1.822-1.671-3.081-1.685-4.182c0-7.599,0-17.096,0-29.605c10.109-11.258,24.634-28.684,30.602-56.322
      c2.084-0.942,4.147-2.002,6.134-3.391c4.945-3.41,9.14-8.362,12.695-15.102c3.576-6.766,6.746-15.418,10.129-27.253
      c1.713-6.003,2.504-11.216,2.504-15.858c0.007-5.343-1.094-9.992-3.116-13.761c-3.032-5.714-7.95-8.892-11.931-10.335
      c-0.44-0.158-0.825-0.255-1.251-0.378l0.302-13.163c0,0,0.702-13.492,0.158-20.507c-1.464-19.056-2.991-38.112-4.229-57.188
      c-0.241-3.713-0.592-7.462-0.592-11.189C359.143,35.478,294.803,0,255.997,0C217.19,0,152.85,35.478,152.85,57.676
      c0,8.494-7.193,85.508-4.456,85.721c0.007,0,0.103,15.102,0.103,16.34c-1.706,0.536-3.514,1.238-5.439,2.414
      c-2.847,1.76-5.729,4.511-7.737,8.286c-2.022,3.769-3.129,8.418-3.122,13.768c0.007,4.642,0.798,9.854,2.51,15.851
      c4.525,15.762,8.61,25.94,13.899,33.402c2.641,3.713,5.652,6.691,8.926,8.953c1.988,1.389,4.051,2.448,6.134,3.391
      c5.969,27.638,20.494,45.064,30.602,56.322c0,12.509,0,22.006,0,29.605c0,0.935-0.371,2.284-1.822,4.209
      c-2.124,2.86-6.533,6.326-11.766,9.263c-5.22,2.971-11.223,5.536-16.477,7.393c-6.169,2.187-16.106,4.456-27.24,7.654
      c-16.731,4.835-36.509,11.808-52.601,25.603c-8.032,6.904-15.088,15.569-20.046,26.338c-4.965,10.762-7.812,23.547-7.806,38.517
      c0,3.473,0.152,7.063,0.468,10.776c0.228,2.6,1.218,4.717,2.38,6.464c2.215,3.246,5.151,5.667,8.83,8.149
      c6.444,4.264,15.37,8.431,26.8,12.522c34.206,12.2,90.837,23.368,161.016,23.382c57.016,0,105.141-7.399,139.491-16.696
      c17.186-4.663,30.905-9.759,40.822-14.854c4.965-2.572,8.981-5.103,12.165-7.881c1.596-1.403,2.991-2.875,4.167-4.621
      c1.156-1.747,2.153-3.864,2.38-6.464c0.31-3.713,0.461-7.289,0.461-10.755C455.517,430.784,450.393,414.706,442.031,402.197z
      M227.829,57.312h56.336V82.73h-56.336V57.312z M177.944,238.835l-0.784-4.436l-4.236-1.513c-2.696-0.962-4.752-1.946-6.547-3.191
      c-2.648-1.87-5.048-4.422-7.853-9.648c-2.772-5.199-5.708-12.97-8.919-24.241c-1.41-4.931-1.912-8.755-1.912-11.602
      c0.006-3.308,0.64-5.24,1.286-6.458c0.977-1.774,2.173-2.531,3.7-3.143c1.224-0.468,2.51-0.591,3.026-0.619l5.866,0.73
      l13.953,28.051v-63.522c18.953-7.675,46.055-17.708,76.313-17.708c23.622,0,46.708,6.127,65.792,12.468l18.843,8.878v59.884
      l14.112-28.381l5.57-0.4c0.475-0.013,2.964,0.234,4.601,1.32c0.887,0.564,1.609,1.225,2.27,2.442
      c0.654,1.218,1.279,3.15,1.293,6.45c0,2.854-0.502,6.678-1.912,11.609c-4.27,15.04-8.101,23.794-11.615,28.649
      c-1.761,2.456-3.37,3.988-5.158,5.24c-1.795,1.244-3.851,2.228-6.547,3.191l-4.237,1.513l-0.784,4.436
      c-4.958,27.755-19.262,43.373-29.826,55.139l-1.987,2.215v2.97c0,14.084,0,24.351,0,32.569c-0.013,5.103,1.974,9.697,4.69,13.362
      c0.261,0.35,0.584,0.653,0.86,0.997l-14.036,29.206h-75.522l-14.091-29.31c0.2-0.24,0.447-0.433,0.633-0.68
      c2.812-3.686,4.972-8.307,4.972-13.576c0-8.218,0-18.485,0-32.569v-2.978l-1.987-2.208
      C197.206,282.208,182.902,266.59,177.944,238.835z M332.661,447.88l-76.657,42.197l-76.657-42.197l11.684-27.508l-31.868-24.86
      l34.041-36.564l62.8,131.129l62.8-131.129l34.041,36.564l-31.868,24.867L332.661,447.88z">
    </path>
  </svg>
`),
        title: 'Courier Driver',
        date: '2020 - 2021',
        description: 'Delivered packages safely and efficiently, ensuring timely arrivals and excellent customer satisfaction.'
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
  <svg width="32" height="32" viewBox="0 0 1024 1024" fill="#f400e0" xmlns="http://www.w3.org/2000/svg">
    <path d="M877.685565 727.913127l-0.584863-0.365539a32.898541 32.898541 0 0 1-8.041866-46.423497 411.816631 411.816631 0 1 0-141.829267 145.777092c14.621574-8.992268 33.62962-5.117551 43.645398 8.772944l0.146216 0.073108a30.412874 30.412874 0 0 1-7.968758 43.206751l-6.141061 4.020933a475.201154 475.201154 0 1 1 163.615412-164.419599 29.974227 29.974227 0 0 1-42.841211 9.357807z m-537.342843-398.584106c7.164571-7.091463 24.71046-9.650239 33.26408 0 10.600641 11.185504 7.164571 29.462472 0 37.138798l-110.612207 107.468569L370.901811 576.14119c7.164571 7.091463 8.114974 27.342343 0 35.384209-9.796455 9.723347-29.828011 8.188081-36.480827 1.535265L208.309909 487.388236a18.423183 18.423183 0 0 1 0-25.953294l132.032813-132.032813z m343.314556 0l132.032813 132.032813a18.423183 18.423183 0 0 1 0 25.953294L689.652124 613.133772c-6.652816 6.579708-25.587754 10.746857-36.553935 0-10.30821-10.235102-7.091463-31.290168 0-38.381632l108.345863-100.669537-111.855041-108.638294c-7.164571-7.676326-9.504023-26.611265 0-36.04218 9.284699-9.138484 26.903696-7.091463 34.068267 0z m-135.54199-26.318833c3.582286-9.504023 21.347498-15.498868 32.679217-11.258612 10.819965 4.020933 17.180349 19.008046 14.256035 28.512069l-119.896906 329.716493c-3.509178 9.504023-20.616419 13.305632-30.193551 9.723347-10.161994-3.509178-21.201282-17.545889-17.545888-26.976804l120.627985-329.716493z" />
  </svg>
`),
        title: 'Full‑Stack Web Developer',
        date: '2022 - Present',
        description: 'Designing and developing responsive websites and web apps using modern technologies and frameworks.'
      }
    ];
  }
}

