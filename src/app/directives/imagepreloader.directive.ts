import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[img-preloader]',
  host: {
    '[attr.src]': 'finalImage'  
  }
})
export class ImagepreloaderDirective implements OnInit {

  @Input('img-preloader') targetSource: string;

  downloadingImage : any; 
  finalImage: any; 

  // Set an input so the directive can set a default image.
  @Input() defaultImage : string = 'assets/img/image-not-found.png';

  constructor() { }
  ngOnInit(): void {
     
     this.finalImage = this.defaultImage;

     this.downloadingImage = new Image(); 

     this.downloadingImage.onload = () => { 
       console.log('image downloaded');
       this.finalImage = this.targetSource;
      }

      this.finalImage.src = this.targetSource;  
     

     

  }

}
