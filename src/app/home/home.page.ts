import { Component, ElementRef, ViewChild, Renderer2, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { AnimationController, Animation, IonContent, Platform, IonSlides, ModalController, LoadingController, AlertController, PickerController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Gesture, GestureController } from '@ionic/angular';
import { PillMenuComponent } from '../components/pill-menu/pill-menu.component';
import { DetallePage } from '../detalle/detalle.page';
import { NuevoRecursoPage } from '../nuevo-recurso/nuevo-recurso.page';
import { BooksComponent } from '../components/books/books.component';
import { BooksService } from '../services/books.service';
import { AuthenticationService } from '../services/authentication.service';
import { TareasService } from '../api/tareas.service';
import { CodesComponent } from '../components/codes/codes.component';
import { Libros } from '../models/Libros';
import { CrearForumPage } from '../pages/crear-forum/crear-forum.page';
import { ForumComponent } from '../components/forum/forum.component';
import { CrearChatPage } from '../pages/crear-chat/crear-chat.page';
import { NewResourcePage } from '../new-resource/new-resource.page';
import { CrearNewsPage } from '../pages/crear-news/crear-news.page';
import { NewsComponent } from '../components/news/news.component';
import { mobiscroll, MbscCalendarOptions, MbscCalendar, MbscCalendarComponent } from '@mobiscroll/angular';
import { WebsocketService } from '../services/websocket.service';
import { ThrowStmt } from '@angular/compiler';
import { CalendarEventsPage } from '../pages/calendar-events/calendar-events.page';
import { CalendarioService } from '../api/calendario.service';
import { MateriasService } from '../api/materias.service';
import { CrearEvidencePage } from '../pages/crear-evidence/crear-evidence.page';
import { EvidencesComponent } from '../components/evidences/evidences.component';
import { CrearTopicPage } from '../pages/crear-topic/crear-topic.page';
import { ListResourceComponent } from '../components/list-resource/list-resource.component';



mobiscroll.settings = {
  theme: 'mobiscroll',
  themeVariant: 'light',
  layout: 'liquid'
};




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private observer: IntersectionObserver;
  scrollenable = false;
  pocisionInicial = true;
  tabs: any = [];
  now: number = Date.now();
  selectOption = '0';
  selectSeccion = 1;
  index = 1 ;
  libros: any[] = [];
  materias: any[] = [];
  librosES: any[] = [];
  librosIN: any[] = []; 
  codigoVisible = true;
  LstTareas: any[] = [];
  hayConexion= true;

  settings: MbscCalendarOptions = {
    theme: 'mobiscroll',
    display: 'inline',
    themeVariant: 'light',
    calendarScroll: 'vertical',
    months: 1,
  onShow: (event, inst) => {
    setTimeout(() => { //temporal
      this.activarEventoTouch();
      this.apiCalendario.getCalendario().subscribe(data => {
      this.events = data;
      });
    }, 100);

  },
  onDayChange : (event, inst) => {
   this.abrirCalendarioSemana(event);

  }
  
};

  @ViewChild('slideDown', {static: false}) slideDown: IonSlides;
  @ViewChild('slideUp', {static: false}) slideUp: IonSlides;
  @ViewChild('slideVertical', {static: true}) slideVertical: IonSlides;
  @ViewChild('toolbar', {read: ElementRef, static: true}) toolbar: ElementRef;
  @ViewChild('toolbar1', {read: ElementRef, static: true}) toolbar1: ElementRef;
  @ViewChild('text', {read: ElementRef, static: true}) text: ElementRef;
  @ViewChild('elementsToProcess', {read: ElementRef, static: true}) elementsToProcess: ElementRef;
  @ViewChild('toolbar2', {read: ElementRef, static: true}) toolbar2: ElementRef;
  @ViewChild('IonContentScroll', {static: true}) IonContentScroll: IonContent;
  @ViewChild('content', {read: ElementRef, static: true}) contentref: ElementRef;
  @ViewChild('calendar', {static: false}) calendar: ElementRef;

  @ViewChild('pillMenu', {static: false}) pillMenu: PillMenuComponent;
  @ViewChild('content2', {read: ElementRef, static: true}) contentref2: ElementRef;
  @ViewChild('div2', {read: ElementRef, static: true}) div2: ElementRef;
  @ViewChild('footer', {read: ElementRef, static: true}) footer: ElementRef;
  @ViewChild('fab', {read: ElementRef, static: true}) fab: ElementRef;
  @ViewChild('fabstart', {read: ElementRef, static: true}) fabstart: ElementRef;
  @ViewChild('fabend', {read: ElementRef, static: true}) fabend: ElementRef;
  @ViewChild('foot', {read: ElementRef, static: true}) foot: ElementRef;
  @ViewChild('animation7', {read: ElementRef, static: true}) animation7: ElementRef;
  @ViewChild('animation8', {read: ElementRef, static: true}) animation8: ElementRef;
  @ViewChild('pillMenu', {read: ElementRef, static: false}) pillMenuRef: ElementRef;
  @ViewChild('forumComponent', {static: false}) forumComponent: ForumComponent;
  @ViewChild('resourceComponent', {static: false}) resourceComponent: ListResourceComponent;
  @ViewChild('evidenceComponent', {static: false}) evidenceComponent: EvidencesComponent;
  @ViewChild('newsComponent', {static: false}) newsComponent: NewsComponent;
  @ViewChild('avatarUser', {read: ElementRef, static: false}) avatarUser: ElementRef;
  @ViewChild('mobi', {static: false}) mobi: MbscCalendar; 

  public fabVisible: boolean = true;
  public fabVisibleFilters: boolean = false;
  items: any[] = [];
  estadoArriba  = false;
  primeraVez = true;
  headersText: any = [];
  header = 'Books';
  nombreIcono = 'book-outline';
  iconos: any[];
  public swipeUp = false;
  public swipeDown = false;
  public gesture;
  public gesture2;
  public user = {
    nombre : '',
    grado  : ''
  };
  slideOpts = {
    loop: true,
  };
  slideOptsdos = {
    autoHeight: true
  };
  events: any;


  // tslint:disable-next-line: max-line-length
  constructor(private statusBar: StatusBar, public platform: Platform, private animationCtrl: AnimationController,
              // tslint:disable-next-line: max-line-length
              private renderer: Renderer2, private gestureCtrl2: GestureController, private gestureCtrl: GestureController, private modalCrl: ModalController, private booksService: BooksService,
              private loadingController: LoadingController, private alertController: AlertController,
              public authenticationService: AuthenticationService ,
              private apiTareas: TareasService, public  webSocket: WebsocketService, private apiCalendario: CalendarioService,
              private pickerController: PickerController, private apiMaterias: MateriasService) {
    //  this.scrollenable = true;


  }

  async animacion(isRegreso: boolean, click: boolean) {

   // if (this.primeraVez) {this.primeraVez = false; return; }
   

    let animation2: Animation;
    let animation4: Animation;
    let animation3: Animation;
    let animation5: Animation;
    let animation6: Animation;
    let animation7: Animation;
    let animation8: Animation;
    let animation9: Animation;
    let animation10: Animation;

    if (!isRegreso) {
   //   this.gesture.enable(false);
    //  this.gesture2.enable(false);
    //  this.renderer.setStyle(this.contentref2.nativeElement, 'z-index', `-1`);

      setTimeout(() => {
       // this.renderer.addClass(this.toolbar2.nativeElement, 'inverted-border-radius');
        this.pillMenu.aplicarSombra();
      }, 70);
   //   this.renderer.addClass(this.foot.nativeElement, 'sombraFooter');
      if (this.estadoArriba) { return; }

    // el ion tool bar le vamos hacer un trnasfor en el eje de la Y  hasta transform: translateY(-5vh);
      animation2 = this.animationCtrl.create('identifier2-a')
    .addElement(this.toolbar.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(0)', 'translateY(-3vh)');

      animation4 = this.animationCtrl.create('identifier4-a')
    .addElement(this.toolbar1.nativeElement)
    .beforeAddClass('colortoolbarUP')
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(0)', 'translateY(-7vh)');

      animation3 = this.animationCtrl.create('identifier3-a')
    .addElement(this.text.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    // tslint:disable-next-line: max-line-length
    .fromTo('transform', ' perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)', 'perspective(1px) translateY(2.01vh) translateZ(0) translateX(-8.01vw) scale(0.8)');

  /*    animation5 = this.animationCtrl.create('my-animation-identifier3')
    .addElement(this.footer.nativeElement)
    .afterAddClass('zindexFooterin')
    .duration(240)
    .delay(0)
    .fromTo('opacity', ' 1', '0');*/




      animation6 = this.animationCtrl.create('identifier6-a')
    .addElement(this.fab.nativeElement)
    .afterAddClass('zindexFooter')
    .duration(700)
    .delay(20)
    .easing('cubic-bezier(.61,1,.88,1)')
   .keyframes([{ offset: 0, transform: 'scale(0)' },
   { offset: 0.2, transform: 'scale(1)' },
   { offset: 0.5, transform: 'scale(1.3)' },
   { offset: 1, transform: 'scale(1)' }, ]);

      animation7 = this.animationCtrl.create('identifier7-a')
   .addElement(this.animation7.nativeElement)
   .duration(300)
   .delay(50)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', ' perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)', 'perspective(1px) translateY(-20vh) translateZ(0) translateX(-'+ this.tamañoMover() + 'vh) scale(calc(1/2))');

      animation8 = this.animationCtrl.create('identifier8-a')
   .addElement(this.animation8.nativeElement)
   .duration(300)
   .delay(40)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', ' translate(0, 0)', 'translate(-2vw, -15.5vh)');

      animation9 = this.animationCtrl.create('identifier9-a')
       .addElement(this.fabstart.nativeElement)
       .afterAddClass('zindexFooter')
       .duration(700)
       .delay(20)
       .easing('cubic-bezier(.61,1,.88,1)')
      .keyframes([{ offset: 0, transform: 'scale(0)' },
      { offset: 0.2, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(1.3)' },
      { offset: 1, transform: 'scale(1)' }, ]);

      animation10 = this.animationCtrl.create('identifier10-a')
        .addElement(this.fabend.nativeElement)
        .afterAddClass('zindexFooter')
        .duration(700)
        .delay(20)
        .easing('cubic-bezier(.61,1,.88,1)')
       .keyframes([{ offset: 0, transform: 'scale(0)' },
       { offset: 0.2, transform: 'scale(1)' },
       { offset: 0.5, transform: 'scale(1.3)' },
       { offset: 1, transform: 'scale(1)' }, ]);


      animation2.play();
      animation3.play();
      animation4.play();
    //  animation5.play();
      animation6.play();
      animation7.play();
      animation8.play();
      animation9.play();
      animation10.play();

     // if (click) {
      this.moveScroll(true);
    //  this.scrollenable = true;
      this.animacionBounce(true);

      // }
      this.estadoArriba = true;
  } else {


    this.moveScroll(false);
    if (this.estadoArriba === false ) { return; }
  //  this.renderer.removeClass(this.toolbar2.nativeElement, 'inverted-border-radius');
  //  this.renderer.removeClass(this.foot.nativeElement, 'sombraFooter');
    
    this.pillMenu.quitarSombra();
    animation2 = this.animationCtrl.create('identifier2-b')
    .addElement(this.toolbar.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(-3vh)', 'translateY(0)');

    animation4 = this.animationCtrl.create('identifier4-b')
    .addElement(this.toolbar1.nativeElement)
    .beforeAddClass('colortoolbarDOWN')
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    .fromTo('transform', 'translateY(-7vh)', 'translateY(0)');


    animation3 = this.animationCtrl.create('identifier3-b')
    .addElement(this.text.nativeElement)
    .duration(300)
    .delay(50)
    .easing('cubic-bezier(0,.70,.45,1)') // muy lento al ultimo -> cubic-bezier(0,.70,.45,1)
    // tslint:disable-next-line: max-line-length
    .fromTo('transform', ' perspective(1px) translateY(2.01vh) translateZ(0) translateX(-8.01vw) scale(0.8)', 'perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)');


  /*  animation5 = this.animationCtrl.create('my-animation-identifier3')
    .addElement(this.footer.nativeElement)
    .afterAddClass('zindexFooterout')
    .duration(100)
    .delay(10)
    .fromTo('opacity', '0', '1');*/




    animation6 = this.animationCtrl.create('identifier6-b')
    .addElement(this.fab.nativeElement)
    .afterAddClass('zindexFooter')
    .duration(200)
    .delay(0)
    .easing('cubic-bezier(.12,0,.39,0)')
   .keyframes([{ offset: 0, transform: 'scale(1)' },

   { offset: 1, transform: 'scale(0)' }, ]);

    animation7 = this.animationCtrl.create('identifier7-b')
   .addElement(this.animation7.nativeElement)
   .duration(300)
   .delay(50)
   .easing('cubic-bezier(.51,1,.88,1)')
   .fromTo('transform', 'perspective(1px) translateY(-18vh) translateZ(0) translateX(-7vw) scale(0.6)', ' perspective(1px) translateY(0) translateZ(0) translateX(0) scale(1)');

    animation8 = this.animationCtrl.create('identifier8-b')
   .addElement(this.animation8.nativeElement)
   .duration(280)
   .delay(0)
   .fromTo('transform' , 'translate(-2vw, -15.5vh)', 'translate(0, 0)');
    

    animation9 = this.animationCtrl.create('identifier9-b')
     .addElement(this.fabstart.nativeElement)
     .afterAddClass('zindexFooter')
     .duration(200)
     .delay(0)
     .easing('cubic-bezier(.12,0,.39,0)')
    .keyframes([{ offset: 0, transform: 'scale(1)' },
  
    { offset: 1, transform: 'scale(0)' }, ]);
   

   
    animation10 = this.animationCtrl.create('identifier10-b')
      .addElement(this.fabend.nativeElement)
      .afterAddClass('zindexFooter')
      .duration(200)
      .delay(0)
      .easing('cubic-bezier(.12,0,.39,0)')
     .keyframes([{ offset: 0, transform: 'scale(1)' },
     { offset: 1, transform: 'scale(0)' }, ]);
    



    animation2.play();
    animation3.play();
    animation4.play();
   //   animation5.play();
    animation6.play();
    animation7.play();
    animation8.play();
    animation9.play();
    animation10.play();
  
    this.animacionBounce(false);
   

    this.estadoArriba = false;



  }


  }


  async moveScroll(directionUp: boolean) {
    /*
    if (directionUp) {
      console.log("move scroll arriba")
    const scrollto: number = (this.platform.height() ) -280;

    this.content.scrollToPoint(0, scrollto, 370);
  } else {
    //   this.scrollenable = false;
      await this.content.scrollToPoint(0, 0, 370);

     this.gesture.enable();
   //  this.gesture2.enable();
    // this.renderer.setStyle(this.contentref2.nativeElement, 'z-index', `4`);
  }
*/
  }

  mover() {
    
    if (this.pocisionInicial) {
    this.animacion(true, false);
    const animation5: Animation = this.animationCtrl.create('bouceEduardohome')
    .addElement(this.div2.nativeElement)
    .duration(350)
    .delay(0)
    .easing(' cubic-bezier(0.61, 1, 0.88, 1)')
  // .beforeStyles({bottom:'-16vh'})
  // .afterStyles({bottom:'-16vh'})
  //   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
    // .fromTo('transform', 'translate3d(0, 67vh, 0)', 'translate3d(0, 0vh, 0)');
     .keyframes([{ offset: 0, transform: 'translate3d(0, -6vh, 0)' },
  
  { offset: 1, transform: 'translate3d(0, 60vh, 0)' }, ]);
  
  
    animation5.play();
  } else {
    this.div2.nativeElement.click();
    this.IonContentScroll.scrollToPoint(0, 0, 400);
  }
    this.div2.nativeElement.click();
    this.IonContentScroll.scrollToPoint(0, 0, 400);
  }

librosDescargados(Libros) {
    this.libros = Libros;
    this.codigoVisible = false;
    this.pillMenu.nextSegment('0');
}


 async  animacionBounce(esHaciaArriba: boolean) {

   /*

const animation5: Animation = this.animationCtrl.create('bouceEduardo')
    .addElement(this.div2.nativeElement)
    .duration(700)
    .delay(0)
// .beforeStyles({bottom:'-16vh'})
 // .afterStyles({bottom:'-16vh'})
 //   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
 //   .fromTo('transform', 'translate3d(0, 40px, 0)', 'translate3d(0, 35px, 0)');
   .keyframes([{ offset: 0, transform: 'translate3d(0, 0px, 0)' },
 { offset: 0.7, transform: 'translate3d(0, 8px, 0)' },
 { offset: 1, transform: 'translate3d(0, 0px, 0)' }, ]);

await animation5.play();
this.content.scrollToPoint(0, 11,0);

this.renderer.addClass(this.div2.nativeElement, 'quitarBottom');


   //  animation5.destroy();
   // animation5.stop();
  //  animation5.destroy();
*/
let duracion;

if(!this.platform.is("ipad") || !this.platform.is("iphone") || !this.platform.is("ios")){
   console.log("android")
   duracion= 1150;
}
else{
  duracion= 550;
}
if (esHaciaArriba) {
const animation5: Animation = this.animationCtrl.create('bouceEduardo-b')
    .addElement(this.div2.nativeElement)
    .duration(duracion)
    .delay(60)
    .easing('cubic-bezier(0,.70,.45,1)')
     .beforeStyles({height: '80vh'})
     .afterStyles({height: '74vh'})
 //   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
    // .fromTo('transform', 'translate3d(0, 67vh, 0)', 'translate3d(0, 0vh, 0)');
     .keyframes([{ offset: 0, transform: 'translate3d(0, 60vh, 0)' },
     { offset: 0.6, transform: 'translate3d(0, -10.5vh, 0)' },
     { offset: 0.9, transform: 'translate3d(0, -5.0vh, 0)' },
 { offset: 1, transform: 'translate3d(0, -6vh, 0)' }, ]);





   //  this.gesture.enable(false);
animation5.play();
this.pillMenu.animacion();
   // this.scrollenable=true;


      // this.renderer.addClass(this.toolbar2.nativeElement, 'inverted-border-radius');
  //    this.gesture.enable(true);



    } else {
     // this.scrollenable=false;
      const animation5: Animation = this.animationCtrl.create('bouceEduardo-c')
  .addElement(this.div2.nativeElement)
  .duration(350)
  .delay(0)
  .easing(' cubic-bezier(0.61, 1, 0.88, 1)')
// .beforeStyles({bottom:'-16vh'})
// .afterStyles({bottom:'-16vh'})
//   .fromTo('transform', 'translate3d(0, 0, 0)', 'translate3d(0, 40px, 0)')
   .fromTo('transform', 'translate3d(0, -6vh, 0)', 'translate3d(0, 60vh, 0)');
  // this.content.scrollToPoint(0, 0, 0);
      this.gesture.enable(false);
 //  this.scrollenable=false;

      await animation5.play();
      this.gesture.enable(true);


    }
this.IonContentScroll.scrollToPoint(0, 0, 0);


  }
  detalle() {

  }


  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    console.log('Width: ' + this.platform.width());
    //  console.log(this.div1);
     // console.log(this.items);
     // let status bar overlay webview
   //  this.statusBar.overlaysWebView(true);

     // set status bar to white
    this.statusBar.backgroundColorByHexString('#FFFFFF');
    this.llenar_libros();
    this.selectSeccion = 1;
    //  this.statusBar.hide();

    this.pillMenu.visibleFab(false);

    this.observer = new IntersectionObserver((entries) => {

        entries.forEach((entry: any) => {
          if (!entry.isIntersecting) {
            this.pocisionInicial = false;
            this.gesture.enable(false);
          } else {
            this.pocisionInicial = true;
            this.gesture.enable(true);
          }
        });
      }, {threshold: 0});

    this.observer.observe(this.elementsToProcess.nativeElement);

    }
    async  ionSlideTouchStart() {

     if (this.estadoArriba) {

       //this.slideUp.lockSwipes(true);

      } else {

      //this.slideUp.lockSwipes(false);
      }

    }
    async ionSlideTouchEndSlide() {

      let index = await this.slideUp.getActiveIndex();

      // Por mientras
      /*index = index === 7 ? 1 : index;
      index = index === 0 ? 6 : index;*/
      index = index === 6 ? 1 : index;
      index = index === 0 ? 5 : index;
      this.header = this.headersText[index - 1];
      this.nombreIcono = this.iconos[index - 1];


      if (index === 1) {
        this.tabs = ['Todos', 'Inglés'  , 'Español', 'Código'];

      } else if (index === 2) {
        this.tabs = ['Tareas', 'Foro', 'Recursos', 'Evidencias'];
     } else if (index === 3) {
      this.tabs = ['Noticias', 'Mensajes', 'Calendario'];

     } else if (index === 4) {
            this.tabs = ['Perfil', 'Materias', 'Estadísticas'];
     } else if (index === 5) {
      this.tabs = ['Preguntas', 'Contacto'];
      }/* } else if (index === 6) {
        this.tabs = ['Alumnos', 'Docentes', 'Cordinadores'];
      }*/

      this.selectOption = '0';
      // console.log(await this.slideDown.getActiveIndex().toString());
      // this.pillMenu.nextSegment((await this.slideDown.getActiveIndex()).toString());


      this.selectSeccion = index;

      if (index === 1) {
         this.fabVisible = false; /*this.pillMenu.visibleFab(false);*/ 
         this.renderer.setStyle(this.fabend.nativeElement,'display','none');
         this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
      } 
      else if (index === 2) { 
         this.fabVisibleFilters = true; /*this.pillMenu.visibleFabFilters(true)*/ 
         if(this.getKeyToken('tipo')=='Profesor') {
          this.renderer.setStyle(this.fabend.nativeElement,'display','block');
         }

         this.renderer.setStyle(this.fabstart.nativeElement,'display','block');
      } 
      else if (index === 3) { 
        this.fabVisibleFilters = true; /*this.pillMenu.visibleFabFilters(true)*/ 
        if(this.getKeyToken('tipo')=='Profesor') {
         this.renderer.setStyle(this.fabend.nativeElement,'display','block');
        }
         
        this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
     } 
      else { 
          this.fabVisibleFilters = false; /*this.pillMenu.visibleFabFilters(false)*/ 
          this.renderer.setStyle(this.fabend.nativeElement,'display','none');
          this.renderer.setStyle(this.fabstart.nativeElement,'display','none');
      }

    }

    activarEventoTouch(){
      

      this.gesture2 = this.gestureCtrl.create({
          el: this.calendar.nativeElement,
          gestureName: 'calendar',
          direction: 'y',
          threshold: 0.5,
          onStart: (detail) => {
            
  
            //this.gesture.disabled();
            //  this.renderer.setStyle(this.div2.nativeElement, 'transition', `none`);
          },
          onMove: (detail) => {
        
            //  this.gesture.disabled();
            },
        });
      this.gesture2.enable();
  }

    ionSlideTransitionStart() {
      setTimeout(() => {
        this.pillMenu.nextSegment('0');
      }, 50);

      // this.pillMenu.nextSegment('0');
    }

    ionViewWillEnter() {
      this.user.nombre = this.getKeyToken('nombre');
      this.user.grado = this.getKeyToken('grado');
    }

    ionViewDidEnter() {
      setTimeout(async () => {
        const status = this.webSocket.getStatusSocket() == 1 ? true : false;
        this.inforConnectionScoket(status);
        if(status==true) {
          this.LstTareas = await this.apiTareas.get().toPromise();
        }
        else
        {
          //console.log("listo");
          this.slideUp.lockSwipes(true);
        }
      }, 100);

    }
    async ngOnInit() {
      this.subscribeToEvents();

      //this.LstTareas = await this.apiTareas.get().toPromise();

      this.iconos = ['book-outline', 'pencil', 'people-outline', 'person-outline', 'hammer-outline'];
      this.headersText = ['Books', 'Tasks', 'Community', 'Account', 'Support'];
      this.tabs = ['Todos', 'Inglés'  , 'Español', 'Código'];


      this.gesture = this.gestureCtrl.create({

        el: this.contentref.nativeElement,
        gestureName: 'test-swipe',
        direction: 'y',
        threshold: 20,
        passive: true,
        disableScroll: true,
        onStart: (detail) => {

          //  this.renderer.setStyle(this.div2.nativeElement, 'transition', `none`);
        },
        onMove: (detail) => {
        
          if (detail.velocityY < -0.50) {
            this.swipeUp = true;
            //console.log("onmoveUp");
          //  this.scrollenable = false
          
           }else{
            //console.log("onmoveDown");
            this.swipeDown = true;
        //    this.scrollenable = false;
            }

        },
        onEnd: (detail) => {
         //   this.scrollenable = false;
            //console.log("SwipeUP",this.swipeUp);
            //console.log("SwipeDown",this.swipeDown);
            if (this.swipeUp === true && !this.estadoArriba) {
              //console.log("entro al if de swipeUp")
              this.swipeUp = true;
              this.animacion(false, true);
              this.div2.nativeElement.click();
              this.estadoArriba = true;
              this.scrollenable = true;
              this.div2.nativeElement.click();
             this.pocisionInicial === true;

           } else {
              if (this.swipeDown === true && this.estadoArriba) {
                this.gesture.enable(true);
                //console.log("entro al if de swipeDown")
             //   if (this.pocisionInicial === true) { causante del problema que no bajaba cuando haciamos swipe para abajo
           //     this.gesture.enable(false);
            //    this.renderer.setStyle(this.div2.nativeElement, 'touch-action', 'none');
                this.div2.nativeElement.click();
                this.scrollenable = false;
               
                this.animacion(true, true); 
            //    this.scrollenable = false;
                this.estadoArriba = false;
// }
             }
            }
            this.swipeUp = false;
            this.swipeDown = false;
          }
      });

      this.gesture.enable();
    }


    segmentChanged(event) {
       this.slideDown.slideTo(event.detail.value);
      // this.slideUp.slideTo(event.detail.value);
    } 

    async openPicker() {
      const picker = await this.pickerController.create({
          mode : 'ios',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Aceptar',
              handler:  (value: any) => {
                  console.log()
                  const itemOption =this.pillMenu.itemsMenu[this.pillMenu.indexAnterior];
                  if(itemOption==="Tareas") {
                    if (value.Meses.value === 0) {
                      this.apiTareas.get().subscribe(data => {
                        this.LstTareas = data;
                      });
                    } else {
                        this.apiTareas.getTareasMaterias(value.Meses.value).subscribe(data => {
                        this.LstTareas = data;
                      });
                    }
                  }
                  else if(itemOption==="Foro") {
                    if (value.Meses.value === 0) {
                        this.forumComponent.cargar(0);
                    } else {
                       this.forumComponent.cargar(value.Meses.value);
                    } 
                  }
                  else if(itemOption==="Recursos") {
                    if (value.Meses.value === 0) {
                        this.resourceComponent.cargar(0);
                    } else {
                       this.resourceComponent.cargar(value.Meses.value);
                    } 
                  }
              }
            }
          ],
          columns: [{
              name: 'Meses',
              options: await this.getColumnOptionsMeses()
            }
          ]
      });
      
      picker.present();
  
    }

    async getColumnOptionsMeses() {
      const options = [];


      this.materias = await this.apiMaterias.get().toPromise();
    
      options.push({text: 'Todas' , value: 0});

      this.materias.forEach(x => {
        options.push({text: x.nombre , value: x.id});
      });
  
      return options;
    }

    async nuevoRecurso(itemOption) {
      
      itemOption = this.pillMenu.itemsMenu[this.pillMenu.indexAnterior];

      if (itemOption === 'Tareas') {
          const modal = await this.modalCrl.create({
            component: NuevoRecursoPage,
            // cssClass: 'my-custom-modal-css',
            cssClass: 'my-custom-modal-css-capturas',
            showBackdrop: false,
            mode: 'ios',
            backdropDismiss: true
          });

          await modal.present();

          modal.onDidDismiss().then( async (data) => {
              this.LstTareas = await this.apiTareas.get().toPromise();
          });
      } else if (itemOption === 'Mensajes') {
        const modal = await this.modalCrl.create({
          component: CrearChatPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          // this.forumComponent.cargar();
        });

      } else if (itemOption === 'Recursos') {
        const modal = await this.modalCrl.create({
          component: NewResourcePage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.resourceComponent.cargar(0);
        });

      } else if (itemOption === 'Noticias') {
        const modal = await this.modalCrl.create({
          component: CrearNewsPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.newsComponent.cargar();
        });

      }else if (itemOption === 'Foro') {
        const modal = await this.modalCrl.create({
          component: CrearForumPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.forumComponent.cargar(0);
        });

      }
      else if (itemOption === 'Evidencias') {
        const modal = await this.modalCrl.create({
          component: CrearEvidencePage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.evidenceComponent.cargar();
        });

      }
      else if (itemOption === 'Calendario') {
        const modal = await this.modalCrl.create({
          component: CrearTopicPage,
          // cssClass: 'my-custom-modal-css',
          cssClass: 'my-custom-modal-css-capturas',
          showBackdrop: false,
          mode: 'ios',
          backdropDismiss: true
        });

        await modal.present();

        modal.onDidDismiss().then( async (data) => {
          this.apiCalendario.getCalendario().subscribe(data => {
            this.events = data;
            });
        });
      }
    }

   async abrirCalendarioSemana(item){

      const modal = await this.modalCrl.create({
        component: CalendarEventsPage,
        // cssClass: 'my-custom-modal-css',
        cssClass: 'my-custom-modal-css-capturas',
        showBackdrop: false,
        mode: 'ios',
        backdropDismiss: true,
        componentProps: {item}
      });

      await modal.present();

    }



    async ionSlideTouchEnd(slideSelect: IonSlides, notSlideSlect: IonSlides) {
      // notSlideSlect.slideTo(await slideSelect.getActiveIndex());
      this.pillMenu.nextSegment(await (await this.slideDown.getActiveIndex()).toString());
    }

    async openDetail(event: Event, item) {

    const modal = await this.modalCrl.create({
        component: DetallePage,
        cssClass: 'my-custom-modal-css',
        mode: 'ios',
        backdropDismiss: true,
        componentProps: {item}
      });

    return await modal.present();
    }


    clickDiv() {
     // console.log("Click Div")

    }

    clickHoyCalendario(){
      this.mobi.instance.navigate(new Date(Date.now()), true);
    }

    clickCalendario(){

    }

    ////// logica libros quitar cuando se cuando se cambie a componente
    llenar_libros() {

      // this.libros = this.booksService.getPost();
    }

    async Salir() {

      const alert = await this.alertController.create({
        header: 'LBS Plus Demo',
        message: '<strong>¿Desea cerrar sesión?</strong>',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {

            }
          }, {
            text: 'Si',
            handler: () => {
              this.authenticationService.logout().then( data => {

                  this.webSocket.finishWebScoket();
              });
              // this.menu.close();
            }
          }
        ]
      });

      await alert.present();
    }

    getKeyToken(key: string): string {

      const jwt = localStorage.getItem('USER_INFO');

      const jwtData = jwt.split('.')[1];
      // let decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtJsonData = decodeURIComponent(escape(window.atob(jwtData)));
      const decodedJwtData = JSON.parse(decodedJwtJsonData);

      const value = decodedJwtData[key];

      return value;
    }

    private subscribeToEvents(): void {
      this.webSocket.connectionEstablished.subscribe((status: any) => {
          this.inforConnectionScoket(status);
      });
    }

    public async inforConnectionScoket(status) {
      if (status == true) {
            this.hayConexion = true;
            this.renderer.setStyle(this.avatarUser.nativeElement, 'color', `#FF426D`);
            this.slideUp.lockSwipes(false);
            this.LstTareas = await this.apiTareas.get().toPromise();
      } else {
            this.hayConexion = false;
            this.renderer.setStyle(this.avatarUser.nativeElement, 'color', `black`);
      }
    }
    public tamañoMover(): number{
        let numberMover = 0;
        if (this.platform.width() >= 250 && this.platform.width() <= 299) {numberMover = 1; }
        if (this.platform.width() >= 300 && this.platform.width() <= 349) {numberMover = 2; }
        if (this.platform.width() >= 350 && this.platform.width() <= 399) {numberMover = 3; }
        if (this.platform.width() >= 400 && this.platform.width() <= 449 ) {numberMover = 4; }
        if (this.platform.width() >= 450 && this.platform.width() <= 499) {numberMover = 5; }
        if (this.platform.width() >= 500 && this.platform.width() <= 549 ) {numberMover = 6; }
        if (this.platform.width() >= 550 && this.platform.width() <= 599) {numberMover = 7; }
        if (this.platform.width() >= 600 && this.platform.width() <= 649 ) {numberMover = 8; }
        if (this.platform.width() >= 650 && this.platform.width() <= 699 ) {numberMover = 9; }
        if (this.platform.width() >= 700 && this.platform.width() <= 749 ) {numberMover = 10; }
        if (this.platform.width() >= 750 && this.platform.width() <= 799 ) {numberMover = 11; }
        if (this.platform.width() >= 800 && this.platform.width() <= 849 ) {numberMover = 12; }
        if (this.platform.width() >= 850 && this.platform.width() <= 899 ) {numberMover = 13; }
        if (this.platform.width() >= 900 && this.platform.width() <= 949 ) {numberMover = 14; }
        if (this.platform.width() >= 950 && this.platform.width() <= 999 ) {numberMover = 15; }
        if (this.platform.width() >= 1000 && this.platform.width() <= 1049  ) {numberMover = 16; }
        if (this.platform.width() >= 1050 && this.platform.width() <= 1099 ) {numberMover = 17; }
        if (this.platform.width() >= 1100 && this.platform.width() <= 1149 ) {numberMover = 18; }
        if (this.platform.width() >= 1150 && this.platform.width() <= 1199 ) {numberMover = 19; }
        if (this.platform.width() >= 1200 && this.platform.width() <= 1249 ) {numberMover = 20; }
        if (this.platform.width() >= 1250 && this.platform.width() <= 1299 ) {numberMover = 21; }
        if (this.platform.width() >= 1300 && this.platform.width() <= 1349 ) {numberMover = 22; }
        if (this.platform.width() >= 1350  ) {numberMover = 23; }

        console.log(numberMover);
        return numberMover;
    }

}

const lorem = 'Lorem iuis aute irure dol cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const images = [
  'bandit',
  'batmobile',
  'blues-brothers',
  'bueller',
  'delorean',
  'eleanor',
  'general-lee',
  'ghostbusters',
  'knight-rider',
  'mirth-mobile'
];

function getImgSrc() {
  const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
  // tslint:disable-next-line: no-use-before-declare
  rotateImg++;
  if (rotateImg === images.length) {
    rotateImg = 0;
  }
  return src;
}

let rotateImg = 0;
