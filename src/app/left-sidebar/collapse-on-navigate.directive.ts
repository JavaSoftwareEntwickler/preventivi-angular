import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BREAKPOINT_SMALL } from '../config/constants';

@Directive({
  selector: '[collapseOnNavigate]',
  standalone: true
})
export class CollapseOnNavigateDirective {

  @Input() collapseBreakpoint = BREAKPOINT_SMALL;  // valore di default
  @Output() collapseOnNavigate = new EventEmitter<void>();

  constructor(private router: Router) {}

  @HostListener('click')
  onClick() {
    if (window.innerWidth < this.collapseBreakpoint) {
      this.collapseOnNavigate.emit();
    }
  }
}
