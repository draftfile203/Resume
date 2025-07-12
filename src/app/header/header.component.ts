import { Component, OnInit } from '@angular/core';
import { RouterModule} from '@angular/router';
import { IntroStateService } from '../services/intro-state.service';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterModule,NgIf,FormsModule,NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  showHeader = false;
  isMobileMenuOpen = false;

  showHireMe = false;
  hireMeAnimatingOut = false;

  constructor(private introState: IntroStateService) {}

  ngOnInit() {
    this.introState.introDone$.subscribe(done => {
      this.showHeader = done;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if(this.isMobileMenuOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  }



  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.classList.remove('no-scroll')
  }

  openHire() {
    this.hireMeAnimatingOut = false;
    this.showHireMe = true;
  }

  closeHire() {
    this.hireMeAnimatingOut = true;

    // After animation ends (match bounceOut duration), hide the modal
    setTimeout(() => {
      this.showHireMe = false;
      this.hireMeAnimatingOut = false;
    }, 800); // 800ms matches CSS bounceOut
  }
}

