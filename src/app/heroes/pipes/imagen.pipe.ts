import { Pipe, PipeTransform } from '@angular/core';
import { Heroe } from '../interfaces/heroes.interface';
@Pipe({
  name: 'imagen',
  // pure : false --> esto ahce qeu cada vez qeu se renderize o cambie le estado de angualr se dispare el pipe, consume mas recursos
  // epro puede ayudar a ser mas reactivo la aplicacion
})
export class ImagenPipe implements PipeTransform {

  transform(heroe: Heroe): string {

    if(!heroe.id && !heroe.alt_img) {
      return 'assets/no-image.png';
    } else if ( heroe.alt_img ) {
      return heroe.alt_img;
    } else {
      return `assets/heroes/${heroe.id}.jpg`;
    }
  }

}
