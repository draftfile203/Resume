import { TestBed } from '@angular/core/testing';

import { IntroStateService } from './intro-state.service';

describe('IntroStateService', () => {
  let service: IntroStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntroStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
