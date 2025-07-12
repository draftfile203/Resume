import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IntroStateService {
  private introDoneSource = new BehaviorSubject<boolean>(false);
  introDone$ = this.introDoneSource.asObservable();

  setIntroDone(done: boolean) {
    this.introDoneSource.next(done);
  }
}
