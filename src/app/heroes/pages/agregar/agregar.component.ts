import { Component, OnInit } from '@angular/core';
import { Publisher, Heroe } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [

    `
    img {
      width: 100%;
      border-radius: 5px;
    }

    `

  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    },
  ];


  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.MarvelComics,
    alt_img: '',    
  }

  constructor(
               private heroesService: HeroesService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private snackBar: MatSnackBar,
               public dialog: MatDialog 
  ) { }

  ngOnInit(): void {

    if( !this.router.url.includes('editar')) {
      return;
    }
    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroeById(id) )
      )
      .subscribe( (heroe) => this.heroe = heroe);

  }

  guardar() {
    if( this.heroe.superhero.trim().length === 0 ) {
      return;
    } 

    if(this.heroe.id) {
      // actualizar
      this.heroesService.actualizarHeroe( this.heroe )
        .subscribe( heroe => this.mostrarSnakbar('Registro Actualizado') )

    } else {
      // Crear
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe( (heroe) => {
          this.router.navigate(['/heroes/editar', heroe.id]);
          this.mostrarSnakbar('Registro Creado');
        });
    }

  }

  borrarHeroe() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed()
    .subscribe(
      (result) => {
        if( result ) {
          
          this.heroesService.borrarHeroe(this.heroe.id!)
            .subscribe( (resp) => {
              this.router.navigate(['/heroes']);
              this.mostrarSnakbar('Registro Eliminado');
            });
         
        }
      }
    )

  }

  mostrarSnakbar( msj:string) {
    this.snackBar.open( msj, 'OK!', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

}
