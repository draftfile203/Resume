import { CommonModule, isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IntroStateService } from '../services/intro-state.service';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgIf,CommonModule,CommonModule,FormsModule,NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('profileImg', { static: false }) profileImg!: ElementRef<HTMLImageElement>;

  showIntro = true;
  private moved = false;
  showContactForm = false;
  contactFormOut = false;


  introMessage = 'WELCOME TO MY SPACE';

  constructor(private introState: IntroStateService, @Inject(PLATFORM_ID) private platformId: Object) {}

 ngAfterViewInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Wait 2s for fade-in, 2s for showing text, then start shatter
    setTimeout(() => {
      const introElement = document.querySelector('.intro-text') as HTMLElement;
      if (introElement) {
        introElement.classList.add('shatter');
      }

      // Wait 0.7s for shatter, then fade out screen
      setTimeout(() => {
        const screen = document.querySelector('.intro-screen') as HTMLElement;
        if (screen) {
          screen.classList.add('fade-out'); // optional if you want to fade out the background
        }

        // Wait 1s then remove the intro screen
        setTimeout(() => {
          this.showIntro = false;
          this.introState.setIntroDone(true);

          // Allow time for DOM update before setting up image listeners
          setTimeout(() => {
            if (this.profileImg) {
              const img = this.profileImg.nativeElement;
              img.addEventListener('mouseenter', () => {
                if (img.classList.contains('centered')) {
                  img.classList.remove('centered');
                  img.classList.add('moved');
                } else if (img.classList.contains('moved')) {
                  img.classList.remove('moved');
                  img.classList.add('centered');
                }
              });

              img.addEventListener('click', () => {
                if (!this.moved) {
                  img.classList.remove('centered');
                  img.classList.add('moved');
                  this.moved = true;
                } else {
                  img.classList.remove('moved');
                  img.classList.add('centered');
                  this.moved = false;
                }
              });
            }
          }, 100);
        }, 1300); // time to remove screen
      }, 1000); // time to shatter
    }, 3000); // 2s fade in + 2s hold
  }
}


  openForm() {
    this.showContactForm = true;
    this.contactFormOut = false
  }

  closeForm() {
    this.contactFormOut = true

    setTimeout(() => {
      this.showContactForm = false
      this.contactFormOut = false
    }, 800);
  }


  sendEmail(event: Event) {
    event.preventDefault();

    emailjs.sendForm(
      'service_1p1dbx9',
      'template_0w9n8sz',
      event.target as HTMLFormElement,
      'UaCXPlnwMWEMKXrTT'
    )
    .then(() => {
      alert('Message sent successfully!');
      this.closeForm();
    })
    .catch((error) => {
      console.error('Email send failed:', error);
      alert('Failed to send message.');
    });
  }
}
