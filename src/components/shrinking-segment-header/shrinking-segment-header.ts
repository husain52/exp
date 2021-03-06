import { Component, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'shrinking-segment-header',
  templateUrl: 'shrinking-segment-header.html'
})
export class ShrinkingSegmentHeader {

  @Input('scrollArea') scrollArea: any;
  @Input('headerHeight') headerHeight: number;

  newHeaderHeight: any;

  constructor(public element: ElementRef, public renderer: Renderer) {
    }

  ngAfterViewInit(){
    this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');

    this.scrollArea.ionScroll.subscribe((ev) => {
      this.resizeHeader(ev);
    });

  }

  resizeHeader(ev){

    console.log("--- Event is ---",ev)

    ev.domWrite(() => {
      this.newHeaderHeight = this.headerHeight - ev.scrollTop;

      if(this.newHeaderHeight < 0){
        this.newHeaderHeight = 0;
      }
      console.log("---resizeHeader---",this.headerHeight+"========",ev.scrollTop)
      this.renderer.setElementStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');
      if(this.newHeaderHeight == 0){
        this.renderer.setElementStyle(this.element.nativeElement, 'display', 'none');
      }else{
        this.renderer.setElementStyle(this.element.nativeElement, 'display', 'flex');
        this.renderer.setElementStyle(this.element.nativeElement, 'align-items', 'initial');
      }

    });

  }





}
