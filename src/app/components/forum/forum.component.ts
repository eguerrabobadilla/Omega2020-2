import { Component, OnInit } from '@angular/core';

import { ForumService } from '../../api/forum.service';
import { DetallesForumPage } from '../../pages/detalles-forum/detalles-forum.page';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
})
export class ForumComponent implements OnInit {
  public LstForo: any[] = [];

  constructor(private apiForum: ForumService, private modalCrl: ModalController) {

  }

  ngOnInit() {
    this.cargar(0);
  }

  public cargar(materiaId) {
    //0=todas 1=Filtrado por materia
    if(materiaId==0){
      this.apiForum.get(false, 0).subscribe(data =>{
        this.LstForo = data;
      });
    }
    else{
      this.apiForum.getForosMaterias(materiaId).subscribe(data =>{
        this.LstForo = data;
      });
    }
  }

  async openDetail(event: Event, item , itemid) {

    /*this.apiForum.get(true,0).subscribe(data =>{
    });*/

    const modal = await this.modalCrl.create({
        component: DetallesForumPage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        componentProps: {item}
      });

    await modal.present();

    modal.onDidDismiss().then( async (data) => {
      this.LstForo = await this.apiForum.get(false, 0).toPromise();
    });
  }

}
